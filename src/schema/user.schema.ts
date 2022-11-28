import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const accessUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirect: z.string().optional(),
});

export type LoginUserInput = z.TypeOf<typeof accessUserSchema>;
