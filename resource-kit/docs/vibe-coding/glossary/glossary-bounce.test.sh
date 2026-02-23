#!/usr/bin/env bash
# Test: Glossary page should not have continuous bounce/drift animations
# Bug: The animate-drift class on a large background div causes the entire
# glossary to visually bounce up and down in a 25-second infinite loop.

set -euo pipefail

GLOSSARY_HTML="$(dirname "$0")/index.html"
EXIT_CODE=0

echo "=== Glossary Bounce Bug Test ==="

# Test 1: No animate-drift class on any element in the glossary page
if grep -q 'animate-drift' "$GLOSSARY_HTML"; then
    echo "FAIL: Found 'animate-drift' class in glossary page."
    echo "      This causes the page to visually bounce due to a large"
    echo "      background element continuously animating its position."
    EXIT_CODE=1
else
    echo "PASS: No animate-drift animation found in glossary page."
fi

exit $EXIT_CODE
