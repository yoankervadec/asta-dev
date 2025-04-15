// 
// server/back-end/models/auth.models.js

import { query } from "../../configs/db.config.js"

// Fetch user by user_name
export const findUserByName = async (user_name) => {
  try {
    const sql = 'SELECT * FROM users WHERE user_name = ?';
    const result = await query(sql, [user_name]);
    return result[0]; // Return the first user found (if any)
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

// Insert new user
export const createUser = async (user_name, hashedPassword) => {
  try {
    const sql = 'INSERT INTO users (user_name, user_password) VALUES (?, ?)';
    await query(sql, [user_name, hashedPassword]);
    return true;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};