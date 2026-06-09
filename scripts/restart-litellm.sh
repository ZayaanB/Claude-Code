#!/bin/bash
# Restarts the LiteLLM proxy after config.yaml updates.
# Recreates the container with the latest configuration.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment variables from .env if it exists.
if [ -f "$BASE_DIR/.env" ]; then
  export $(grep -v '^#' "$BASE_DIR/.env" | xargs -d '\n')
fi

# Verify NVIDIA_NIM_API_KEY is configured.
if [ -z "$NVIDIA_NIM_API_KEY" ]; then
  echo "Error: NVIDIA_NIM_API_KEY is not set. Please check your .env file."
  exit 1
fi

echo "Stopping and removing old liteLLM container..."
docker stop litellm-nim >/dev/null 2>&1 || true
docker rm litellm-nim >/dev/null 2>&1 || true

echo "Starting new LiteLLM container..."
docker run -d \
  -p 8081:4000 \
  -e NVIDIA_NIM_API_KEY="$NVIDIA_NIM_API_KEY" \
  -v "$BASE_DIR/config.yaml:/app/config.yaml" \
  --name litellm-nim \
  --restart always \
  docker.litellm.ai/berriai/litellm:main-stable \
  --config /app/config.yaml

echo "LiteLLM container restarted successfully!"
