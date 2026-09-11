import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "El name es obligatorio"),
  email: z.email("El email debe tener un formato correcto y es obligatorio"),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
