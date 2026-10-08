import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import logger from './logging';
import path from 'path';

dotenv.config({ path: '../../.env' });

const execAsync = promisify(exec);
console.log(__dirname);
var repoPath = path.join(__dirname, process.env.BACKUPFOLDER);

/**
 * Ensures a restic repository exists.
 * If it does not exist, it initializes it.
 * 
 * @param {string} repoPath - Absolute path to repository
 * @param {object} env - Environment variables (must include RESTIC_PASSWORD)
 */
export async function ensureResticRepo(env = process.env) {
  try {
    // Try to query snapshots to see if repo exists
    await execAsync(`restic -r "${repoPath}" snapshots`, { env });
    logger.log('Restic repository already exists.');
    return true;
  } catch (err) {
    // If repo doesn't exist, initialize it
    logger.log('Repository not found. Initializing...');
    try {
      await execAsync(`restic -r "${repoPath}" init`, { env });
      console.log('Restic repository initialized.');
      return true;
    } catch (initErr) {
      console.error('Failed to initialize repository:', initErr.stderr || initErr);
      return false
    }
  }
}