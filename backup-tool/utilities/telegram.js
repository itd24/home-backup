import dotenv from 'dotenv';
import axios from 'axios';
import logger from './logging';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegram(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    logger.warn('Telegram not configured')
    return false;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  try {
    const response = await axios.post(url, {
        chat_id: CHAT_ID,
        text: message,
      });
    return true;
  } catch (err) {
    logger.error('Telegram send failed:', err.message)
    return false;
  }
}