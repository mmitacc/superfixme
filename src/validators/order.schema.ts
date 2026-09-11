import { z } from "zod";

const orderItemInput = z.object({
  productId: z.number(),
  quantity: z.number(),
});

export const createOrderSchema = z.object({
  userId: z.number(),
  items: z.array(orderItemInput),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPED", "CANCELLED"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
