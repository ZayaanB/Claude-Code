#!/bin/bash
# Restart the LiteLLM container with GLM 5.1
# This script stops/removes the old container and starts a new one

# Load environment variables from .env file if it exists
if [ -f "/home/zayaan/claude_ai/.env" ]; then
  export $(grep -v '^#' /home/zayaan/claude_ai/.env | xargs)
fi

# Check if API key is set
if [ -z "$NVIDIA_NIM_API_KEY" ]; then
  echo "Error: NVIDIA_NIM_API_KEY is not set. Please check your .env file."
  exit 1
fi

echo "Stopping and removing old liteLLM container..."
docker stop litellm-nim && docker rm litellm-nim

echo "Starting new LiteLLM container with GLM 5.1..."
docker run -d \
  -p 8081:4000 \
  -e NVIDIA_NIM_API_KEY="$NVIDIA_NIM_API_KEY" \
  -v /home/zayaan/claude_ai/config.yaml:/app/config.yaml \
  --name litellm-nim \
  --restart always \
  docker.litellm.ai/berriai/litellm:main-stable \
  --config /app/config.yaml

echo "LiteLLM container restarted successfully!"
