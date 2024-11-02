import mysql from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const pool: Pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 10,
});

export default pool;
