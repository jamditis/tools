#!/usr/bin/env bash
# check-copilot-instructions.sh -- keep every repo's .github/copilot-instructions.md
# inside a 4,000-character cap.
#
# The cap is a house budget, and saying so is the point: this check used to describe
# it as a platform limit the Copilot review bot enforces by silently dropping the
# tail. Nobody could source that. GitHub documents no hard size, character, or token
# limit for .github/copilot-instructions.md and no truncation threshold or mechanism.
# It does warn that shorter instruction files are more likely to be fully processed,
# recommends limiting any single file to about 1,000 lines, and asks for generated
# onboarding instructions no longer than two pages. Four thousand characters sits
# comfortably inside both length recommendations, so it remains a deliberately
# conservative house budget rather than a claim about platform behavior (tools#71).
#
# It earns its keep either way. Three files once reached 4,000 by restating ~1,700
# chars of prose-style globals the bot cannot enforce anyway; the fix was to keep each
# file to bot-enforceable rules plus the repo's own bug classes. Holding that line has
# meant a manual `wc -c` sweep. This turns that sweep into one repeatable check: it
# prints each file's size, warns when a file creeps toward the cap, and exits non-zero
# if any file is over it, so a growing bug-class list cannot quietly push a repo back
# past the budget.
#
# It also runs an advisory scan for the prose-style globals (sentence case, banned
# words) that the bot ignores, so a file that starts restating them again is flagged
# before it eats the budget. The advisory never changes the exit code; only the hard
# cap does.
#
# Counts are per repo, not per directory scanned. ~/projects holds worktrees sharing one
# .git and separate clones of the same upstream, so one over-cap file used to be reported
# once per checkout: the summary read as nine over-cap repos when there was one file to
# fix (tools#77). Checkouts are folded by their origin URL and reported as one row, with
# the largest file in the group shown so a stale sibling cannot hide an over-cap one.
# The advisory scan still reads every checkout, since folding the count must not fold the
# coverage.
#
# Usage:
#   scripts/check-copilot-instructions.sh [REPO_DIR ...]
#
# With no arguments it scans every repo directory under ~/projects. Pass one or more
# repo roots to check a specific set. Exit code is 0 when every file is under the
# cap, 1 when any file is over it.
#
# Background: tools/CLAUDE.md "Copilot review instructions", tools issues #59, #71, #77.

set -euo pipefail

CAP=4000    # conservative house budget inside GitHub's published length guidance
WARN=3600   # "well under 4,000" headroom: flag a file creeping toward the cap

usage() {
  # Print the header comment (up to the first blank line after the shebang) as help.
  sed -n '2,/^$/p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
}

case "${1:-}" in
  -h | --help) usage ;;
esac

# Resolve the repo list: explicit args, or every immediate subdirectory of ~/projects.
repos=()
if [[ $# -gt 0 ]]; then
  repos=("$@")
else
  for d in "$HOME"/projects/*/; do
    [[ -d "$d" ]] && repos+=("${d%/}")
  done
fi

if [[ ${#repos[@]} -eq 0 ]]; then
  echo "no repos to check (looked under ~/projects; pass repo roots as arguments)" >&2
  exit 0
fi

# Prose-style globals the bot cannot enforce. A line stating one of these as a rule
# is wasted cap budget (tools#59); a line noting they are intentionally omitted is
# not, so the exclusion below skips the "we drop these" notes the cleaned files carry.
# The exclusion matches only the meta-note vocabulary (omitted, excluded, the bot,
# a style linter). It deliberately does NOT match "do not", because a negative-form
# rule -- "Do not use Title Case" -- is a real restatement to flag, not a meta-note.
PROSE_MARKERS='sentence case|banned word|title case|emoji'
PROSE_EXCLUDE='intentional|omit|exclud|not enforce|bot ignores|style linter|not read'

# The upstream repo a checkout points at, so the same repo seen through several local
# checkouts is counted once. The default scan walks ~/projects, which holds worktrees
# sharing one .git and separate clones of the same upstream; counting each as its own
# repo made the summary line read as nine over-cap repos when there was one over-cap
# file (tools#77). The origin URL collapses both cases, since worktrees and clones of a
# repo all point at the same remote. A checkout with no origin falls back to its shared
# git directory, which still collapses worktrees, and a directory that is not a repo at
# all falls back to its own path so it is never merged with anything else.
repo_identity() {
  local repo="$1" abs toplevel url host common

  abs="$(cd "$repo" 2>/dev/null && pwd -P)" || abs=""

  # A directory that merely SITS INSIDE a checkout must not borrow that checkout's
  # identity. `git -C` searches upward, so both `remote get-url origin` and
  # `--git-common-dir` answer for the enclosing repo, and two unrelated
  # subdirectories would fold into one row. Only a directory that is itself a
  # worktree root gets a git identity; that still includes linked worktrees and
  # clones, which are exactly what we want folded. Everything else is its own path.
  toplevel="$(git -C "$repo" rev-parse --show-toplevel 2>/dev/null)" || toplevel=""
  if [[ -z "$abs" || -z "$toplevel" || "$toplevel" != "$abs" ]]; then
    printf 'path:%s' "${abs:-$repo}"
    return
  fi

  if url="$(git -C "$repo" remote get-url origin 2>/dev/null)" && [[ -n "$url" ]]; then
    url="${url%.git}"
    if [[ "$url" == *://* ]]; then
      # A real URL: host[:port]/path. Keep it as written apart from the scheme and
      # any userinfo -- rewriting a colon here would mangle a port into a path
      # segment.
      url="${url#*://}"
      url="${url#*@}"
    else
      # scp form, `[user@]host:owner/repo`, where the single colon separates host
      # from path and does convert to a slash.
      url="${url#*@}"
      url="${url/:/\/}"
    fi
    # Case-fold only where case genuinely does not distinguish repos. GitHub
    # owner/repo is case-insensitive, so git@github.com:Owner/Repo and
    # https://github.com/owner/repo are one repo. Lowercasing every origin would
    # instead merge distinct repos on a case-sensitive host.
    host="${url%%/*}"
    [[ "${host,,}" == "github.com" ]] && url="${url,,}"
    printf 'origin:%s' "$url"
    return
  fi

  if common="$(git -C "$repo" rev-parse --git-common-dir 2>/dev/null)" && [[ -n "$common" ]]; then
    # The same main worktree answers `.git` from inside itself and an absolute path
    # from a linked worktree, and a trailing slash or relative argument leaves a
    # third spelling. They have to be canonicalized or the fold silently stops
    # working for exactly the no-origin worktrees this branch exists to catch.
    [[ "$common" != /* ]] && common="$abs/$common"
    common="$(cd "$common" 2>/dev/null && pwd -P)" || common="$abs/.git"
    printf 'gitdir:%s' "$common"
    return
  fi

  printf 'path:%s' "$abs"
}

# Collect every file first, then report one row per upstream repo. Reporting inside the
# scan loop is what produced the duplicate rows.
declare -A group_name group_chars group_files group_count group_paths
order=()

for repo in "${repos[@]}"; do
  file="$repo/.github/copilot-instructions.md"
  [[ -f "$file" ]] || continue
  name="$(basename "$repo")"
  chars="$(wc -c <"$file" | tr -d ' ')"
  key="$(repo_identity "$repo")"

  if [[ -z "${group_count[$key]:-}" ]]; then
    order+=("$key")
    group_count[$key]=1
    group_name[$key]="$name"
    group_chars[$key]="$chars"
    group_files[$key]="$file"
    group_paths[$key]="$name"
    continue
  fi
  group_count[$key]=$((group_count[$key] + 1))
  group_paths[$key]="${group_paths[$key]}, $name"
  # Every checkout stays in the list, because the advisory scan below reads all of them.
  # Folding the count must not fold the coverage: a sibling on a different commit can
  # restate prose-style globals the representative file does not.
  group_files[$key]="${group_files[$key]}"$'\n'"$file"
  # Checkouts of one repo can sit at different commits, so report the largest file in
  # the group. That is the one that breaches the budget, and hiding it behind a smaller
  # sibling would turn the dedup into a way to miss a real over-cap file.
  if [[ "$chars" -gt "${group_chars[$key]}" ]]; then
    group_chars[$key]="$chars"
    group_name[$key]="$name"
  fi
done

checked=0 over=0 near=0 advisories=0 duplicates=0
printf '%-30s %8s  %s\n' "REPO" "CHARS" "STATUS"
printf '%-30s %8s  %s\n' "----" "-----" "------"

for key in "${order[@]}"; do
  checked=$((checked + 1))
  name="${group_name[$key]}"
  chars="${group_chars[$key]}"

  if [[ "$chars" -gt "$CAP" ]]; then
    status="OVER CAP (+$((chars - CAP)) past $CAP)"
    over=$((over + 1))
  elif [[ "$chars" -ge "$WARN" ]]; then
    status="near cap ($((CAP - chars)) left)"
    near=$((near + 1))
  else
    status="ok"
  fi
  printf '%-30s %8s  %s\n' "$name" "$chars" "$status"

  if [[ "${group_count[$key]}" -gt 1 ]]; then
    duplicates=$((duplicates + group_count[$key] - 1))
    printf '  same repo in %s local checkouts: %s\n' \
      "${group_count[$key]}" "${group_paths[$key]}"
  fi

  # Advisory: prose-style-globals restatement, excluding the "omit these" notes. Every
  # checkout in the group is scanned so a sibling on a different commit is still caught,
  # and identical findings are collapsed so the folded checkouts do not restore the
  # duplicate output this change removed.
  hits=""
  while IFS= read -r checkout; do
    [[ -n "$checkout" ]] || continue
    found="$(grep -inE "$PROSE_MARKERS" "$checkout" | grep -ivE "$PROSE_EXCLUDE" || true)"
    [[ -n "$found" ]] && hits="${hits}${found}"$'\n'
  done <<<"${group_files[$key]}"
  hits="$(printf '%s' "$hits" | sort -u | sed '/^$/d')"
  if [[ -n "$hits" ]]; then
    advisories=$((advisories + 1))
    while IFS= read -r line; do
      printf '  advisory: prose-style rule the bot ignores -> %s\n' "${line}"
    done <<<"$hits"
  fi
done

echo
if [[ "$checked" -eq 0 ]]; then
  echo "no .github/copilot-instructions.md files found in the ${#repos[@]} repo(s) scanned"
  exit 0
fi

summary="checked $checked repo(s): $over over cap, $near near cap, $advisories with prose-globals advisories"
if [[ "$duplicates" -gt 0 ]]; then
  summary="$summary ($duplicates duplicate checkout(s) folded in)"
fi
echo "$summary"
if [[ "$over" -gt 0 ]]; then
  echo "FAIL: $over repo(s) over the ${CAP}-char cap." >&2
  echo "Trim the project bug-class list, or move a section into" >&2
  echo ".github/instructions/<name>.instructions.md with an applyTo glob." >&2
  exit 1
fi
echo "OK: every file is under the ${CAP}-char cap"
