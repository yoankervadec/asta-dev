//
// server/back-end/controllers/auth.controllers.js

import bcrypt from "bcrypt";
import { findUserByName, createUser } from "../models/auth/auth.models.js";

// Register user
export const registerUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Call model function to create user
    await createUser(userName, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await findUserByName(userName);

    if (user) {
      const validPassword = await bcrypt.compare(password, user.user_password);

      if (validPassword) {
        req.session.userId = user.user_id; // Store user ID in session
        req.session.userName = user.user_name;
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
};

export const checkSession = (req, res) => {
  if (req.session && req.session.userId) {
    // User is authenticated
    return res.status(200).json({ isAuthenticated: true });
  } else {
    // User is not authenticated
    return res.status(200).json({ isAuthenticated: false });
  }
};
