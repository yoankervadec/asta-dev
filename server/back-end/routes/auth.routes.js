// 
// server/back-end/routes/auth.routes.js

import express from 'express';
import { loginUser, registerUser, logoutUser, checkSession } from '../controllers/auth.controllers.js';

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.get('/check-session', checkSession);

export default router;