import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { UserModel } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import type { LoginInput, RegisterInput } from './auth.validation.js';
import type { SignOptions } from 'jsonwebtoken';

const SALT_ROUNDS = 12;

function createAccessToken(userId: string, email: string) {
  if (!env.JWT_SECRET) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'JWT secret is not configured.',
      'JWT_SECRET_MISSING',
    );
  }

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign({ userId, email }, env.JWT_SECRET, options);
}

function toAuthUser(user: { id: string; name: string; email: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function register(input: RegisterInput) {
  const normalizedEmail = input.email.toLowerCase();
  const existingUser = await UserModel.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      'An account with this email already exists.',
      'EMAIL_ALREADY_EXISTS',
    );
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await UserModel.create({
    name: input.name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  return {
    user: toAuthUser({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }),
    accessToken: createAccessToken(user._id.toString(), user.email),
  };
}

async function login(input: LoginInput) {
  const normalizedEmail = input.email.toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid email or password.',
      'INVALID_CREDENTIALS',
    );
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid email or password.',
      'INVALID_CREDENTIALS',
    );
  }

  return {
    user: toAuthUser({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }),
    accessToken: createAccessToken(user._id.toString(), user.email),
  };
}

export const authService = {
  register,
  login,
};
