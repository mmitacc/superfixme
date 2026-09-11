import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import { validateBody, validateParamsId } from "../middleware/validate.ts";
import { NotFoundError } from "../middleware/errorHandler.ts";
import { createProductSchema, updateProductSchema } from "../validators/product.schema.ts";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Lista productos (filtros: categoryId, minPrice, maxPrice, inStock)'
  const { category } = req.query;
  const where = category ? { categoryId: Number(category) } : undefined;
  const products = await prisma.product.findMany({ where, include: { category: true }, orderBy: { id: "asc" } });
  res.json(products);
});

productsRouter.get("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Obtiene un producto por id'
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true },
  });
  if (!product) throw new NotFoundError("Producto no encontrado");
  res.json(product);
});

productsRouter.post("/", validateBody(createProductSchema), async (req, res) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Crea un producto'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { name: 'Teclado mecanico', description: 'Switches azules', price: 49.99, stock: 20, categoryId: 1 }
     } */
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json(product);
});

productsRouter.put("/:id", validateParamsId(), validateBody(updateProductSchema), async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Actualiza un producto'
  const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(product);
});

productsRouter.delete("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Elimina un producto'
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
