# Host scripts

Backing up and syncing has to happen on the host machine: the backup scripts call the
running Paperless container (`docker exec`), which is not possible from inside another
container in a sensible way.

## Prerequisites

* [rclone](https://rclone.org/downloads/) installed and available in `PATH`
* [7-Zip](https://www.7-zip.org/) installed and available in `PATH` (used for maximum
  compression of the database and Paperless archives)
* an SSH key and `~/.ssh/config` entry for the host that stores the off-site copies.
  `backupData.bat` uses the host name `backup-host` by default, override it with the
  `BACKUP_HOST` environment variable.
* `docker` available in `PATH` (the Paperless export runs through `docker exec`)

## Google Drive remote

The Google Drive remote is expected to be named `gdrive`:

```
Inside the Rclone interactive prompt:

n  # Create new remote
name> gdrive  # Name your remote
Storage> drive  # Select Google Drive
client_id>  # Press Enter (or use your Google API credentials)
client_secret>  # Press Enter (or use your Google API credentials)
scope> 1  # Select 'Full Access' (Recommended)
root_folder_id>  # Press Enter (leave empty)
service_account_file>  # Press Enter (leave empty)
Edit advanced config? No
Use auto config? No
```

The resulting `rclone.conf` contains OAuth credentials and is therefore **not** part of
this repository. Create it in your rclone config directory (usually
`%APPDATA%\rclone\rclone.conf`) or pass it with `rclone --config`.

## Schedule the scripts with Task Scheduler

| Script | Suggested schedule | What it does |
|---|---|---|
| `syncGDrive.bat` | every 10 minutes | Copies phone scans from Google Drive to the local scan folder and deletes them from Drive |
| `backupData.bat` | daily at 01:00 | Exports Paperless, compresses it, copies it to the backup host and to an external drive |
| `dbBackups.bat` | daily at 01:00 | Dumps all PostgreSQL databases, compresses the dump and keeps 30 days |

See `README-task-scheduler.md` for step by step instructions and the folder
`Task scheduler tasks/` for exported task definitions that can be imported (adjust the
paths and user in them first).

Every path and credential used by the scripts can be supplied through environment
variables, so nothing in this repository is hardcoded to a specific machine:

| Variable | Used by | Default |
|---|---|---|
| `BACKUP_LOCATION` | `backupData.bat` | `D:\Home\BACKUPS` |
| `BACKUP_LOCATION_TMP` | `backupData.bat` | `D:\Home\BACKUPS\tmp` |
| `REMOTE_BACKUP_LOCATION` | `backupData.bat` | `/mnt/backup/` |
| `LOCAL_BACKUP_LOCATION` | `backupData.bat` | `E:\backup\paperless` |
| `BACKUP_HOST` | `backupData.bat` | `backup-host` |
| `PAPERLESS_CONTAINER` | `backupData.bat` | `paperless` |
| `CONTAINER_NAME`, `BACKUP_FOLDER`, `RETENTION_DAYS`, `PG_USER`, `PG_PASSWORD` | `dbBackups.bat` | `dbhome`, `E:\backup\database`, `30`, `postgres`, `change-me` |
| `LOCAL_FOLDER`, `GDRIVE_FOLDER` | `syncGDrive.bat` | `C:/SCANS/gdrive`, `gdrive:/Automations/archiving` |

