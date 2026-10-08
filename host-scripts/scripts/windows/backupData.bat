@echo off
setlocal enabledelayedexpansion

:: All paths and the backup host can be overridden with environment variables.
:: The defaults below are used when a variable is not defined.
if not defined BACKUP_LOCATION set "BACKUP_LOCATION=D:\Home\BACKUPS"
if not defined BACKUP_LOCATION_TMP set "BACKUP_LOCATION_TMP=D:\Home\BACKUPS\tmp"
if not defined REMOTE_BACKUP_LOCATION set "REMOTE_BACKUP_LOCATION=/mnt/backup/"
if not defined LOCAL_BACKUP_LOCATION set "LOCAL_BACKUP_LOCATION=E:\backup\paperless"
if not defined BACKUP_HOST set "BACKUP_HOST=backup-host"
if not defined PAPERLESS_CONTAINER set "PAPERLESS_CONTAINER=paperless"

set "BACKUPLOCATION=%BACKUP_LOCATION%"
set "BACKUPLOCATIONTMP=%BACKUP_LOCATION_TMP%"
set "REMOTEBACKUPLOCATION=%REMOTE_BACKUP_LOCATION%"
set "LOCALBACKUPLOCATION=%LOCAL_BACKUP_LOCATION%"

if not exist "!BACKUPLOCATIONTMP!" mkdir "!BACKUPLOCATIONTMP!"

:: Delete all files in the tmp folder
del /q "!BACKUPLOCATIONTMP!\*"

:: Delete all .7z files in the backup folder
del /q "!BACKUPLOCATION!\*.7z"

:: Get the current date and time formatted as YYYY-MM-DD-HH-MM
for /f "delims=" %%I in ('powershell -Command "Get-Date -Format \"yyyy-MM-dd-HH-mm\""') do set FILENAME=%%I.7z

:: Call the paperless Docker container to export documents
docker exec %PAPERLESS_CONTAINER% document_exporter /backup/tmp

:: use 7z to achieve maximum compression
7z a -mx9 "!BACKUPLOCATION!\!FILENAME!" "!BACKUPLOCATIONTMP!\*"

:: SSH command to copy the archive file to the backup host
scp "!BACKUPLOCATION!\!FILENAME!" root@%BACKUP_HOST%:!REMOTEBACKUPLOCATION!

:: Delete backups older than 5 days on the backup host
ssh root@%BACKUP_HOST% "find !REMOTEBACKUPLOCATION! -type f -mtime +5 -exec rm {} \;"

:: Finally move the archive to an external drive and delete files older than 15 days there
if not exist "!LOCALBACKUPLOCATION!" mkdir "!LOCALBACKUPLOCATION!"

move /Y "!BACKUPLOCATION!\!FILENAME!" "!LOCALBACKUPLOCATION!"

forfiles /p "!LOCALBACKUPLOCATION!" /m "*.7z" /d -15 /C "cmd /c del @path"

echo "Script finished successfully"

endlocal