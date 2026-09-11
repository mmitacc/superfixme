import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "name es requerido").optional(),
  email: z.string(),
});

export const updateUserSchema = createUserSchema;

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
