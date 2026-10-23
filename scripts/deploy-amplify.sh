#!/usr/bin/env bash
# Build the static site and deploy it to the manually-deployed Amplify app.
# Usage: bash scripts/deploy-amplify.sh [app-id] [branch]
# Needs: AWS CLI logged in, and .env.local with the NEXT_PUBLIC_DD_* values
# (they are baked into the build; the Amplify app has no Git connection).
set -euo pipefail

APP_ID="${1:-deiozh6jsqyzm}"
BRANCH="${2:-main}"
ZIP="$(mktemp -d)/site.zip"

cd "$(dirname "$0")/.."

echo "==> Building"
rm -rf out
npm run build
(cd out && zip -qr "$ZIP" .)

echo "==> Creating deployment on $APP_ID/$BRANCH"
read -r JOB_ID UPLOAD_URL < <(aws amplify create-deployment \
  --app-id "$APP_ID" --branch-name "$BRANCH" \
  --query '[jobId, zipUploadUrl]' --output text)

echo "==> Uploading build (job $JOB_ID)"
curl -sSf -X PUT -T "$ZIP" -H "Content-Type: application/zip" "$UPLOAD_URL"

echo "==> Starting deployment"
aws amplify start-deployment --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID" >/dev/null

while true; do
  STATUS=$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH" --job-id "$JOB_ID" \
    --query 'job.summary.status' --output text)
  echo "    status: $STATUS"
  case "$STATUS" in
    SUCCEED) echo "==> Live at https://$BRANCH.$APP_ID.amplifyapp.com"; break ;;
    FAILED|CANCELLED) exit 1 ;;
  esac
  sleep 5
done
