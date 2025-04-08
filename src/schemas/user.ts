import { z } from 'zod';

export const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  email: z
    .string()
    .email('Invalid email address'),
  role: z
    .enum(['admin', 'user'], {
      invalid_type_error: 'Role must be either admin or user',
    }),
});

export type UserFormData = z.infer<typeof userSchema>;