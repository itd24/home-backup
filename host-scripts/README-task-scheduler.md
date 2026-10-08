# Task Scheduler

The three batch scripts in `scripts/windows` are started by the Windows Task Scheduler. The
exported task definitions in `Task scheduler tasks/` are the quick way to set this up, the
manual steps at the bottom do the same thing by hand.

## Import the exported tasks

1. Open the Task Scheduler (`Win + R`, then `taskschd.msc`).
2. Open the three XML files in `Task scheduler tasks/` and replace the placeholder path
   `C:\path\to\home-backup\host-scripts\scripts\windows\` with the real path on your
   machine. The `<UserId>` in them is a dummy SID and is replaced when the task is
   imported.
3. Use *Action > Import Task...* once per XML file.
4. Open each imported task, go to *General* and set *When running the task, use the
   following user account* to your own user, with *Run whether user is logged on or not*.

| Task definition | Trigger | Script |
|---|---|---|
| `Backup Database.xml` | daily at 01:00 | `dbBackups.bat` |
| `Backup Paperless Data.xml` | daily at 01:00 | `backupData.bat` |
| `Sync GDrive folder.xml` | daily, repeated every 10 minutes | `syncGDrive.bat` |

## Create the tasks by hand

1. *Create Task* (not *Create Basic Task*, the simple wizard cannot repeat every ten
   minutes).
2. *Triggers > New*: daily at 01:00 for the two backup jobs. For `syncGDrive.bat` take
   daily as well and tick *Repeat task every*, set it to 10 minutes and the duration to
   *Indefinitely*.
3. *Actions > New > Start a program*: pick the `.bat` file. Leave the arguments empty; the
   scripts read their paths from the environment.
4. *General*: select your user, choose *Run whether user is logged on or not*, and tick
   *Run with highest privileges* if the backup target is not writable for a normal user.
5. *Settings*: tick *Run task as soon as possible after a scheduled start is missed*.

## Settings worth checking

- *Conditions*: untick *Start the task only if the computer is on AC power* on a machine
  that also runs on battery.
- *Settings > Stop the task if it runs longer than*: set it to a value that is comfortably
  above the duration of the largest Paperless export.
- The tasks run without a user session, but they read the environment variables that are
  listed in `README.md` (`BACKUP_LOCATION`, `BACKUP_HOST`, `PG_PASSWORD`, ...). Variables
  defined for a single user are not visible to a task that runs as another account. Define
  them as system wide variables when in doubt.
