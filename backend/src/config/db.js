import "dotenv/config";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined. Check your backend/.env file.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
    console.error("PostgreSQL pool error:", err);
});

const query = (text, params) => pool.query(text, params);

const testConnection = async () => {
    try {
        await pool.query("select 1");
        console.log("PostgreSQL connected");
    } catch (err) {
        console.error("PostgreSQL connection failed:", err.message);
    }
};

export { pool, query, testConnection };