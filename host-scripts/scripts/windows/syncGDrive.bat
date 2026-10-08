@echo off

:: Both folders can be overridden with environment variables.
if not defined LOCAL_FOLDER set "LOCAL_FOLDER=C:/SCANS/gdrive"
if not defined GDRIVE_FOLDER set "GDRIVE_FOLDER=gdrive:/Automations/archiving"

:: Step 1: Copy files from Google Drive to local folder
rclone copy "%GDRIVE_FOLDER%" "%LOCAL_FOLDER%" --progress

:: Step 2: Delete files from Google Drive after successful copy
rclone delete "%GDRIVE_FOLDER%" --progress