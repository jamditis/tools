#!/usr/bin/env bash
# check-copilot-instructions.sh -- guard every repo's .github/copilot-instructions.md
# against the ~4,000-character silent-truncation cap the Copilot PR review bot enforces.
#
# Copilot's PR review bot reads .github/copilot-instructions.md with a roughly
# 4,000-char cap and silently drops anything past it (tools#59). Three files once
# reached that cap by restating ~1,700 chars of prose-style globals the bot cannot
# enforce anyway; the fix was to keep each file to bot-enforceable rules plus the
# repo's own bug classes, well under cap. Holding that line has meant a manual
# `wc -c` sweep. This turns that sweep into one repeatable check: it prints each
# file's size, warns when a file creeps toward the cap, and exits non-zero if any
# file is over it, so a growing bug-class list cannot push a repo back into silent
# truncation unnoticed.
#
# It also runs an advisory scan for the prose-style globals (sentence case, banned
# words) that the bot ignores, so a file that starts restating them again is flagged
# before it eats the cap budget. The advisory never changes the exit code; only the
# hard cap does.
#
# Usage:
#   scripts/check-copilot-instructions.sh [REPO_DIR ...]
#
# With no arguments it scans every repo directory under ~/projects. Pass one or more
# repo roots to check a specific set. Exit code is 0 when every file is under the
# cap, 1 when any file is over it.
#
# Background: tools/CLAUDE.md "Copilot review instructions", tools issue #59.

set -euo pipefail

CAP=4000    # the bot's silent-truncation ceiling
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

checked=0 over=0 near=0 advisories=0
printf '%-30s %8s  %s\n' "REPO" "CHARS" "STATUS"
printf '%-30s %8s  %s\n' "----" "-----" "------"

for repo in "${repos[@]}"; do
  file="$repo/.github/copilot-instructions.md"
  [[ -f "$file" ]] || continue
  checked=$((checked + 1))
  name="$(basename "$repo")"
  chars="$(wc -c <"$file" | tr -d ' ')"

  if [[ "$chars" -gt "$CAP" ]]; then
    status="OVER CAP (+$((chars - CAP)) past $CAP -- tail is being truncated)"
    over=$((over + 1))
  elif [[ "$chars" -ge "$WARN" ]]; then
    status="near cap ($((CAP - chars)) left)"
    near=$((near + 1))
  else
    status="ok"
  fi
  printf '%-30s %8s  %s\n' "$name" "$chars" "$status"

  # Advisory: prose-style-globals restatement, excluding the "omit these" notes.
  hits="$(grep -inE "$PROSE_MARKERS" "$file" | grep -ivE "$PROSE_EXCLUDE" || true)"
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

echo "checked $checked file(s): $over over cap, $near near cap, $advisories with prose-globals advisories"
if [[ "$over" -gt 0 ]]; then
  echo "FAIL: $over file(s) over the ${CAP}-char cap are losing their tail to silent truncation" >&2
  exit 1
fi
echo "OK: every file is under the ${CAP}-char cap"
