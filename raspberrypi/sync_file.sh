#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "Error: .env file not found. Copy .env.example to .env and configure it."
    exit 1
fi

source "$SCRIPT_DIR/.env"

LOCAL_FILE="$SCRIPT_DIR/process_data.py"

fswatch -0 "$LOCAL_FILE" | while read -d "" event
do
    rsync -az --update "$LOCAL_FILE" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
    echo "File updated on remote server at $(date)"
done
