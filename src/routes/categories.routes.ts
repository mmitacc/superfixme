import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import { validateBody, validateParamsId } from "../middleware/validate.ts";
import { NotFoundError } from "../middleware/errorHandler.ts";
import { createCategorySchema, updateCategorySchema } from "../validators/category.schema.ts";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Lista todas las categorias'
  const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
  res.json(categories);
});

categoriesRouter.get("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Obtiene una categoria por id, incluyendo sus productos'
  const category = await prisma.category.findUnique({
    where: { id: Number(req.params.id) },
    include: { products: true },
  });
  if (!category) throw new NotFoundError("Categoria no encontrada");
  res.json(category);
});

categoriesRouter.post("/", validateBody(createCategorySchema), async (req, res) => {
  /* #swagger.tags = ['Categories']
     #swagger.summary = 'Crea una categoria'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { name: 'Electronica' }
     } */
  const category = await prisma.category.create({ data: req.body });
  res.status(201).json(category);
});

categoriesRouter.put("/:id", validateParamsId(), validateBody(updateCategorySchema), async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Actualiza una categoria'
  const category = await prisma.category.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(category);
});

categoriesRouter.delete("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Elimina una categoria'
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
