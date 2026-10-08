import logger from './utilities/logging';
import { checkAndCreateBackupfolder } from './utilities/directoryUtilities';

logger.info('Starting backup process...');

// check for backup folders (database, documents) and create them if not existing
checkAndCreateBackupfolder();

// create temporary metadata json

// backup database

// backup files

// make metadata check (sizes and so on)

// if metadata checks out, replace the original metadata with the tmp metadata and delete the tmp

// run restic for local backup database, files and metadata (all in the same parent folder)

// run restic for remote copy to the backup host

// clear not needed files (CFG policy)

// send telegram message that backup was done (add date and time)

logger.info('Backup process finished');