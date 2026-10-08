import dotenv from 'dotenv';
import { Client } from "pg";

dotenv.config({ path: '../.env' });
dotenv.config({ path: './.env', override: true });

export async function validateDatabase() {
    const client = new Client({
      host: process.env.POSTGRES_DB_HOST,
      user: process.env.POSTGRES_ADMIN_USER,
      password: process.env.POSTGRES_ADMIN_PASSWORD,
      database: process.env.POSTGRES_DB_DATABASE
    });
  
    await client.connect();
  
    const res = await client.query(
      "SELECT COUNT(*) FROM documents_document;"
    );
  
    const count = parseInt(res.rows[0].count);
  
    await client.end();

    if (count < 100) {
      return false;
    } 
    
    return true;
  }