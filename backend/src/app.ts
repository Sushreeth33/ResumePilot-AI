import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.js';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { authRoutes } from './modules/auth/auth.routes.js';

export const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);
