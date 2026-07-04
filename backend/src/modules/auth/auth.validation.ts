import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .trim()
    .min(2, 'Name must be at least 2 characters long.')
    .max(80, 'Name must be at most 80 characters long.'),
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .trim()
    .email('Email must be valid.')
    .toLowerCase(),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(8, 'Password must be at least 8 characters long.')
    .max(128, 'Password must be at most 128 characters long.'),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .trim()
    .email('Email must be valid.')
    .toLowerCase(),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(1, 'Password is required.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
