#!/bin/sh
rclone sync gdrive:/personal/Automations/archiving /local --progress
echo "Google Drive folder synced at $(date)"
