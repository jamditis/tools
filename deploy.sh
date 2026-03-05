#!/usr/bin/env bash
# Deploy tools to Cloudflare Pages (personal account)
set -euo pipefail
cd "$(dirname "$0")"

export CLOUDFLARE_API_TOKEN=$(pass show claude/api/cloudflare-full)
export CLOUDFLARE_ACCOUNT_ID="3d4b1d36109e30866bb7516502224b2c"

COMMIT_MSG=$(git log -1 --format="%h %s" 2>/dev/null || echo "manual deploy")
echo "Deploying tools..."
echo "Commit: $COMMIT_MSG"

# Stage to a temp directory, excluding files over 25MB (Cloudflare Pages limit)
STAGING=$(mktemp -d)
trap "rm -rf $STAGING" EXIT

echo "Staging files (excluding >25MB)..."
rsync -a --exclude='.git' --max-size=25M . "$STAGING/"

# Clear wrangler account cache (prevents cross-account contamination)
rm -f "$HOME/node_modules/.cache/wrangler/wrangler-account.json" "$HOME/node_modules/.cache/wrangler/pages.json" 2>/dev/null

npx wrangler pages deploy "$STAGING/resource-kit/docs" \
  --project-name=tools-pages \
  --branch=master \
  --commit-message="$COMMIT_MSG" --commit-dirty=true

echo "Done: https://tools-pages.pages.dev"
