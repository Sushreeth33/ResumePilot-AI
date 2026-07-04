import { Router } from 'express';
import { validateBody } from '../../middleware/validation.middleware.js';
import { login, register } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validation.js';

export const authRoutes = Router();

authRoutes.post('/register', validateBody(registerSchema), register);
authRoutes.post('/login', validateBody(loginSchema), login);
