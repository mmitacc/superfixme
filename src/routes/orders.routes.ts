import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import { validateBody, validateParamsId } from "../middleware/validate.ts";
import { NotFoundError } from "../middleware/errorHandler.ts";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.schema.ts";

export const ordersRouter = Router();

const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: { include: { product: true } },
};

ordersRouter.get("/", async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.summary = 'Lista ordenes (filtros: status, userId)'
  const orders = await prisma.order.findMany({ include: orderInclude, orderBy: { id: "asc" } });
  res.json(orders);
});

ordersRouter.get("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.summary = 'Obtiene una orden por id'
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) }, include: orderInclude });
  if (!order) throw new NotFoundError("Orden no encontrada");
  res.json(order);
});

ordersRouter.post("/", validateBody(createOrderSchema), async (req, res) => {
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Crea una orden a partir de un usuario y una lista de items (productId, quantity)'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { userId: 1, items: [{ productId: 1, quantity: 2 }] }
     } */
  const { userId, items } = req.body;

  const order = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Usuario no encontrado");

    const productIds = items.map((item: { productId: number }) => item.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== new Set(productIds).size) {
      throw new NotFoundError("Uno o mas productos no existen");
    }

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return tx.order.create({
      data: {
        userId,
        items: {
          create: items.map((item: { productId: number; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: products.find((p) => p.id === item.productId)!.price,
          })),
        },
      },
      include: orderInclude,
    });
  });

  res.status(201).json(order);
});

ordersRouter.patch("/:id/status", validateParamsId(), validateBody(updateOrderStatusSchema), async (req, res) => {
  /* #swagger.tags = ['Orders']
     #swagger.summary = 'Actualiza el estado de una orden'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { status: 'PAID' }
     } */
  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: { status: req.body.status },
    include: orderInclude,
  });
  res.json(order);
});

ordersRouter.delete("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Orders']
  // #swagger.summary = 'Elimina una orden y sus items'
  await prisma.$transaction([
    prisma.order.delete({ where: { id: Number(req.params.id) } }),
    prisma.orderItem.deleteMany({ where: { orderId: Number(req.params.id) } }),
  ]);
  res.status(204).send();
});
