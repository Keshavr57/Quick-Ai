import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { auth } from '../middlewares/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/profile', auth, getProfile);

export default authRouter;