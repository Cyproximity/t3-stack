import {z} from "zod"

export const createProductGroupSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().max(400).optional(),
  published: z.boolean().default(false)
});

export type createProductGroupInput = z.TypeOf<typeof createProductGroupSchema>;

export const createProductSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().max(400).optional(),
  stock: z.number().max(10000),
  price: z.number().min(0),
  groupId: z.string().trim().min(1)
});

export type createProducInput = z.TypeOf<typeof createProductSchema>;
