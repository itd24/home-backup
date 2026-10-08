# Home Backup

Backup tooling for my home server. It is one of six parts that belong together, see also
`home-setup`, `home-api`, `home-dashboard`, `scanner-service` and `reverse-proxy`.

The repository is split in two halves. `backup-tool/` is a small Node.js library that runs
the backup steps and writes a log plus a Telegram message. `host-scripts/` holds the shell
and batch scripts that the Windows Task Scheduler triggers. Together they cover the
PostgreSQL dump, the Paperless export, the copy to a second machine and the sync of the
phone scans.

| Folder | What it is |
|---|---|
| `backup-tool/` | Node.js library that orchestrates the steps (PostgreSQL dump validation, Paperless export, restic snapshots, Telegram notifications) |
| `host-scripts/` | Shell and batch scripts that run on the host: rclone sync of phone scans, Paperless export and off-site copy, PostgreSQL dump |

## Why the scripts run on the host

The scripts are not containerised on purpose. They call `docker exec` on the running
Paperless and PostgreSQL containers and they use the rclone, restic and 7z installations
of the host. A container would only add a second set of credentials and mounts.

## Where the data ends up

1. A local folder on the host, configured with `BACKUPFOLDER`.
2. A second machine that is reached over `scp` and `ssh`, configured with `BACKUP_HOST`.
3. An off-site restic repository with its own encrypted password.
4. Google Drive for the phone scans, synced with rclone.

## Quick start

```bash
# backup tool
cd backup-tool
yarn install
cp .env.example .env      # fill in your own values
node backup.js

# host scripts
cd ../host-scripts
# see README.md there for the rclone remote "gdrive", 7z, docker and the backup host over SSH
```

## Design notes

- Passwords and host names are never hardcoded. The batch scripts fall back to sensible
  defaults but read `BACKUP_LOCATION`, `BACKUP_HOST`, `PG_PASSWORD` and the other
  variables from the environment when those are defined. `host-scripts/README.md` lists
  every variable.
- `rclone.conf`, the SSH private key and the Google service account file are gitignored.
- A database dump is validated before it is copied away, so a broken dump does not
  overwrite a good backup.
- The backup tool sends a short summary to Telegram when the run has finished. Telegram
  is optional and is skipped when no token is configured.

## License

Private project, no license granted.
