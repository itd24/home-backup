@echo off
setlocal

:: Configuration. Every value can be overridden with an environment variable.
if not defined CONTAINER_NAME set "CONTAINER_NAME=dbhome"
if not defined BACKUP_FOLDER set "BACKUP_FOLDER=E:\backup\database"
if not defined RETENTION_DAYS set "RETENTION_DAYS=30"
if not defined PG_USER set "PG_USER=postgres"
if not defined PG_PASSWORD set "PG_PASSWORD=change-me"

:: Ensure backup folder exists
if not exist "%BACKUP_FOLDER%" mkdir "%BACKUP_FOLDER%"

:: Generate filename with timestamp
for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set dt=%%I
set "TIMESTAMP=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%_%dt:~8,2%-%dt:~10,2%-%dt:~12,2%"
set "BACKUP_FILE=%BACKUP_FOLDER%\postgres_backup_%TIMESTAMP%.sql"

:: Run PostgreSQL dump from Docker
echo Dumping PostgreSQL databases...
docker exec -e PGPASSWORD=%PG_PASSWORD% %CONTAINER_NAME% pg_dumpall -U %PG_USER% -f /tmp/backup.sql

:: Copy the backup file from the container to the host
docker cp %CONTAINER_NAME%:/tmp/backup.sql "%BACKUP_FILE%"

:: Compress the backup using 7-Zip
echo Compressing backup...
7z a -mx9 "%BACKUP_FILE%.7z" "%BACKUP_FILE%" 

:: Delete the uncompressed SQL file after compression
del "%BACKUP_FILE%"

:: Delete backups older than 30 days
forfiles /P "%BACKUP_FOLDER%" /M "*.7z" /D -%RETENTION_DAYS% /C "cmd /c del @path"

echo Backup complete and old backups removed!

exit /b
