import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import logger from './logging';

dotenv.config({ path: '../../.env' });

var backupFolder = path.join(__dirname, process.env.BACKUPFOLDER);

export async function checkAndCreateBackupfolder() {
    try {
        await fs.promises.mkdir(backupFolder, { recursive: true });
        return true;
      } catch (err) {
        logger.error('Error creating directory:', err);
        return false;
      }
}