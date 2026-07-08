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

echo
echo "=== $pass passed, $fail failed ==="
[[ $fail -eq 0 ]]
