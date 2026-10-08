# backup-tool

Node.js helper library for the backup process. It is a work in progress: `backup.js`
orchestrates the steps (database dump, Paperless export, restic snapshots, metadata
validation, Telegram notification) and the `utilities/` modules implement them.

## Modules

| Module | Purpose |
|---|---|
| `backup.js` | Entry point / orchestration skeleton |
| `utilities/directoryUtilities.js` | Creates the backup folders (`BACKUPFOLDER`) |
| `utilities/databaseValidation.js` | Runs the data validation queries on PostgreSQL |
| `utilities/dockerUtils.js` | Helpers that talk to the local docker daemon |
| `utilities/resticUtilities.js` | Ensures the restic repository exists and runs snapshots |
| `utilities/telegram.js` | Sends progress/verification messages to Telegram |
| `utilities/logging.js` | winston logger with daily rotating files |
| `tests/` | Jest tests for the utility modules |

## Setup

```bash
yarn install
cp .env.example .env      # fill in your own values
```

The utilities call `dotenv.config({ path: '../../.env' })`, so the `.env` file is
expected in the parent directory of the process working directory.

## Run

```bash
node backup.js
yarn test
```

## Notes

- `restic` and `7z` must be installed on the host and available in `PATH`.
- The tool never stores credentials in git. Everything comes from the environment, see
  `.env.example`.
- A Telegram bot token and chat id are optional. When they are missing the notification
  step is skipped and only a warning is logged.
