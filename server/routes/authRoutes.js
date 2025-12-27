import express from 'express';
import { signup, login, getProfile, googleLogin } from '../controllers/authController.js';
import { auth } from '../middlewares/auth.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/google', googleLogin);
authRouter.get('/profile', auth, getProfile);

export default authRouter;