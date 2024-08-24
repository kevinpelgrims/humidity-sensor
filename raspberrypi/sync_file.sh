#!/bin/bash

LOCAL_FILE="./process_data.py"
REMOTE_USER="kevin"
REMOTE_HOST="raspberrypi.local"
REMOTE_PATH="/home/kevin/Projects/humidity-sensor/raspberrypi"

fswatch -0 "$LOCAL_FILE" | while read -d "" event
do
    rsync -az --update "$LOCAL_FILE" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
    echo "File updated on remote server at $(date)"
done
