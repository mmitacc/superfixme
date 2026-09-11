import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  //Bug: en prisma dice descripcion es opcional ? pero zod lo tiene como obligatorio
  description: z.string(),
  //Bug: price:z.number() solo comprueba que el precio sea un número, pero no comprueba si se manda un número negativo.
  //Por ejemplo price puedes ser igual a -200 
  price: z.number().positive(),
  //Bug: stock: z.number() no esta validando si el stock es un numero entero(Int) o si es negativo.
  stock: z.number().int().positive(),
  categoryId: z.number(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
