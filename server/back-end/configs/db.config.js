//
// server/back-end/configs/db.config.js

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a pool of connections to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  multipleStatements: true,
});

// Export a query function that uses the pool
export const query = async (sql, params, connection = null) => {
  const conn = connection || (await pool.getConnection()); // Use provided connection or fetch from pool
  try {
    const [results] = await conn.query(sql, params); // Execute the query
    return results;
  } catch (error) {
    throw new Error("Database query failed: " + error.message);
  } finally {
    if (!connection) conn.release(); // Release only if using a pool connection
  }
};

// Export the pool for manual connection handling (e.g., transactions)
export const getConnection = async () => {
  return await pool.getConnection();
};

process.on("SIGINT", async () => {
  console.log("Closing jobs database pool...");
  await pool.end();
  process.exit(0);
});
