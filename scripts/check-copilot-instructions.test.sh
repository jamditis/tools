#!/usr/bin/env bash
# Test for check-copilot-instructions.sh: builds fixture repos in a temp dir and
# asserts the guard's exit code and output on under-cap, near-cap, and over-cap
# files, plus the prose-globals advisory. Run: scripts/check-copilot-instructions.test.sh
set -uo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
guard="$here/check-copilot-instructions.sh"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

pass=0 fail=0
ok() { echo "  [PASS] $1"; pass=$((pass + 1)); }
no() { echo "  [FAIL] $1"; fail=$((fail + 1)); }

# check <desc> <cmd...> -- run the command (inheriting any here-string on stdin) and
# record pass/fail by its exit status. Keeps assertions out of the A && B || C idiom.
check() { local desc="$1"; shift; if "$@"; then ok "$desc"; else no "$desc"; fi; }

mkfile() { # mkfile <repo> <char-count> <extra-line>
  local repo="$tmp/$1" n="$2" extra="${3:-}"
  mkdir -p "$repo/.github"
  local f="$repo/.github/copilot-instructions.md"
  # A header line, then filler to reach n bytes, then the optional extra line.
  { printf '# copilot rules\n'; head -c "$n" </dev/zero | tr '\0' 'x'; [[ -n "$extra" ]] && printf '\n%s\n' "$extra"; } >"$f"
}

# under cap, no advisory
mkfile under 200 ""
# near cap (>= 3600, < 4000)
mkfile near 3700 ""
# over cap (> 4000)
mkfile over 4200 ""
# under cap but restates a prose-style global the bot ignores (advisory)
mkfile prosey 200 "Use sentence case, never Title Case."
# under cap with a "we omit these" note (should NOT advise)
mkfile omits 200 "Prose-style globals (sentence case, banned words) are intentionally omitted."
# under cap, restates a prose global as a NEGATIVE rule -- must still be flagged
mkfile negrule 200 "Do not use Title Case in headings."

echo "=== a clean set (under + near, no over) exits 0 ==="
out="$("$guard" "$tmp/under" "$tmp/near" 2>&1)"; rc=$?
check "exit 0 when nothing is over cap" test "$rc" -eq 0
check "flags the near-cap file" grep -q "near cap" <<<"$out"

echo "=== an over-cap file fails the gate (exit 1) ==="
out="$("$guard" "$tmp/under" "$tmp/over" 2>&1)"; rc=$?
check "exit 1 when a file is over cap" test "$rc" -eq 1
check "labels the over-cap file" grep -q "OVER CAP" <<<"$out"
# The failure says what to do about it. It also must not go back to explaining the cap
# as silent truncation: that mechanism was never sourced, and asserting it is what sent
# three earlier passes trimming files to satisfy a limit nobody could point at (#71).
check "the failure names the remedy" grep -q ".github/instructions/" <<<"$out"
check "the failure does not claim truncation" test -z "$(grep -i 'truncat' <<<"$out" || true)"

echo "=== a file exactly at the 4000-char cap is not over (guards the -gt boundary) ==="
# Written byte-exact, not via mkfile (which prepends a header). A file of exactly CAP
# bytes must pass: it pins the core comparison at -gt, so a regression to -ge -- which
# would wrongly flag a 4000-char file as over cap -- fails here and only here.
mkdir -p "$tmp/boundary/.github"
head -c 4000 </dev/zero | tr '\0' 'x' >"$tmp/boundary/.github/copilot-instructions.md"
out="$("$guard" "$tmp/boundary" 2>&1)"; rc=$?
check "exit 0 for a file exactly at the cap" test "$rc" -eq 0
check "a file exactly at the cap is not flagged over" test -z "$(grep 'OVER CAP' <<<"$out" || true)"

echo "=== the prose-globals advisory fires, and exit stays 0 ==="
out="$("$guard" "$tmp/prosey" 2>&1)"; rc=$?
check "advisory does not change the exit code" test "$rc" -eq 0
check "flags a restated prose-style rule" grep -q "advisory: prose-style rule" <<<"$out"

echo "=== an 'intentionally omitted' note is not flagged ==="
out="$("$guard" "$tmp/omits" 2>&1)"
check "skips the omission note" test -z "$(grep advisory <<<"$out" || true)"

echo "=== a negative-form prose rule is still flagged (not suppressed) ==="
out="$("$guard" "$tmp/negrule" 2>&1)"
check "flags 'Do not use Title Case' as a restatement" grep -q "advisory: prose-style rule" <<<"$out"

echo "=== a repo with no copilot file is skipped cleanly ==="
mkdir -p "$tmp/empty"
out="$("$guard" "$tmp/empty" 2>&1)"; rc=$?
check "exit 0 when no file is present" test "$rc" -eq 0

# The dedup cases (tools#77). ~/projects holds several checkouts of the same repo --
# worktrees sharing one .git, and separate clones of one upstream -- and counting each
# as its own repo made one over-cap file report as nine.
mkrepo() { # mkrepo <name> <char-count> [origin-url]
  local repo="$tmp/$1"
  mkfile "$1" "$2"
  git -C "$repo" init -q
  [[ -n "${3:-}" ]] && git -C "$repo" remote add origin "$3"
  git -C "$repo" add -A >/dev/null 2>&1
  git -C "$repo" -c user.email=t@example.com -c user.name=t commit -qm init >/dev/null 2>&1
}

echo "=== two clones of one upstream count as one repo ==="
mkrepo cloneA 4200 https://github.com/example/shared.git
mkrepo cloneB 4200 git@github.com:Example/shared.git
out="$("$guard" "$tmp/cloneA" "$tmp/cloneB" 2>&1)"; rc=$?
check "still fails on the over-cap file" test "$rc" -eq 1
check "counts one repo, not two" grep -q "checked 1 repo(s): 1 over cap" <<<"$out"
check "names the folded checkouts" grep -q "same repo in 2 local checkouts" <<<"$out"
check "reports the duplicate count" grep -q "1 duplicate checkout(s) folded in" <<<"$out"

echo "=== a worktree is folded into its parent even with no origin ==="
mkrepo solo 200
git -C "$tmp/solo" worktree add -q "$tmp/solo-wt" -b wt >/dev/null 2>&1
out="$("$guard" "$tmp/solo" "$tmp/solo-wt" 2>&1)"
check "worktree does not double-count" grep -q "checked 1 repo(s)" <<<"$out"

echo "=== distinct repos are still counted separately ==="
mkrepo distinctA 200 https://github.com/example/one.git
mkrepo distinctB 200 https://github.com/example/two.git
out="$("$guard" "$tmp/distinctA" "$tmp/distinctB" 2>&1)"
check "two upstreams stay two repos" grep -q "checked 2 repo(s)" <<<"$out"

echo "=== non-repo directories are never merged together ==="
mkfile plainA 200
mkfile plainB 200
out="$("$guard" "$tmp/plainA" "$tmp/plainB" 2>&1)"
check "two plain directories stay two repos" grep -q "checked 2 repo(s)" <<<"$out"

echo "=== the largest checkout wins, so a stale clone cannot hide an over-cap file ==="
# Checkouts of one repo can sit at different commits. Reporting the smaller one would
# turn the dedup into a way to miss the file that is actually over the cap.
mkrepo staleA 200 https://github.com/example/drift.git
mkrepo staleB 4200 https://github.com/example/drift.git
out="$("$guard" "$tmp/staleA" "$tmp/staleB" 2>&1)"; rc=$?
check "over-cap sibling still fails the gate" test "$rc" -eq 1
check "reports the larger file" grep -q "OVER CAP" <<<"$out"

echo "=== folding the count must not fold the advisory coverage ==="
# Only the smaller sibling restates a prose-style global. Scanning just the largest file
# in the group would report nothing, so the dedup would have quietly narrowed the check.
mkrepo advA 4200 https://github.com/example/cover.git
mkfile advB 200 "Use sentence case, never Title Case."
git -C "$tmp/advB" init -q
git -C "$tmp/advB" remote add origin https://github.com/example/cover.git
out="$("$guard" "$tmp/advA" "$tmp/advB" 2>&1)"
check "still one repo" grep -q "checked 1 repo(s)" <<<"$out"
check "advisory from the smaller checkout is still reported" \
  grep -q "advisory: prose-style rule" <<<"$out"

echo "=== identical checkouts report an advisory once, not once per checkout ==="
mkrepo dupA 200 https://github.com/example/twice.git
mkfile dupB 200 "Use sentence case, never Title Case."
# Same content as dupA's file so the finding is genuinely identical, not just similar.
cp "$tmp/dupA/.github/copilot-instructions.md" "$tmp/dupB/.github/copilot-instructions.md" 2>/dev/null || true
printf 'Use sentence case, never Title Case.\n' >>"$tmp/dupA/.github/copilot-instructions.md"
cp "$tmp/dupA/.github/copilot-instructions.md" "$tmp/dupB/.github/copilot-instructions.md"
git -C "$tmp/dupB" init -q
git -C "$tmp/dupB" remote add origin https://github.com/example/twice.git
out="$("$guard" "$tmp/dupA" "$tmp/dupB" 2>&1)"
check "identical advisory is not printed twice" \
  test "$(grep -c 'advisory: prose-style rule' <<<"$out")" -eq 1

echo "=== a plain directory inside a checkout does not borrow its origin ==="
# `git -C` searches upward, so a directory that is merely nested in a repo answers
# with the PARENT's origin and common git dir. Without a worktree-root check, two
# unrelated subdirectories fold into one row and one of the files stops being counted.
mkrepo nested 200 https://github.com/example/nested.git
mkfile nested/inner1 200
mkfile nested/inner2 200
out="$("$guard" "$tmp/nested/inner1" "$tmp/nested/inner2" 2>&1)"
check "nested plain directories are not folded by the parent's origin" \
  grep -q "checked 2 repo(s)" <<<"$out"

echo "=== a no-origin worktree folds even when the path is spelled differently ==="
# `--git-common-dir` answers `.git` from inside the main worktree but an absolute
# path from a linked one, and a trailing slash leaves a third spelling. Unless the
# key is canonicalized, the fold quietly stops working for the no-origin case.
mkrepo slashed 200
git -C "$tmp/slashed" worktree add -q "$tmp/slashed-wt" -b wt >/dev/null 2>&1
out="$("$guard" "$tmp/slashed/" "$tmp/slashed-wt" 2>&1)"
check "trailing slash still folds the worktree" grep -q "checked 1 repo(s)" <<<"$out"

echo "=== distinct non-GitHub origins are not merged by case folding ==="
# GitHub owner/repo is case-insensitive, so folding case there is correct. Applying
# it to every host merges repos that a case-sensitive server keeps separate.
mkrepo caseA 200 https://git.example.com/Org/Repo.git
mkrepo caseB 200 https://git.example.com/org/repo.git
out="$("$guard" "$tmp/caseA" "$tmp/caseB" 2>&1)"
check "case-distinct non-GitHub origins stay two repos" grep -q "checked 2 repo(s)" <<<"$out"

echo "=== GitHub origins still fold across case and URL form ==="
# The counterpart: the case folding that finding removes for other hosts must
# survive for GitHub, or the original dedup regresses.
mkrepo ghA 200 git@github.com:Example/Shared.git
mkrepo ghB 200 https://github.com/example/shared
out="$("$guard" "$tmp/ghA" "$tmp/ghB" 2>&1)"
check "GitHub case and scp form still fold" grep -q "checked 1 repo(s)" <<<"$out"

echo "=== an SSH URL with a port keeps the port out of the path ==="
# Stripping the scheme then rewriting the first colon turns host:2222/org/repo into
# host/2222/org/repo. Same-repo URLs written both ways must still agree.
mkrepo portA 200 "ssh://git@git.example.com:2222/org/repo.git"
mkrepo portB 200 "ssh://git@git.example.com:2222/org/repo"
out="$("$guard" "$tmp/portA" "$tmp/portB" 2>&1)"
check "a ported SSH origin folds with its .git-suffixed twin" grep -q "checked 1 repo(s)" <<<"$out"

echo
echo "=== $pass passed, $fail failed ==="
[[ $fail -eq 0 ]]
