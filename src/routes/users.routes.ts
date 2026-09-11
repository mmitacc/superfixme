import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import { validateBody, validateParamsId } from "../middleware/validate.ts";
import { NotFoundError } from "../middleware/errorHandler.ts";
import { createUserSchema, updateUserSchema } from "../validators/user.schema.ts";

export const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Lista todos los usuarios'
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  res.json(users);
});

usersRouter.get("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Obtiene un usuario por id'
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) throw new NotFoundError("Usuario no encontrado");
  res.json(user);
});

usersRouter.post("/", validateBody(createUserSchema), async (req, res) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Crea un usuario'
     #swagger.parameters['body'] = {
       in: 'body',
       schema: { name: 'Ada Lovelace', email: 'ada@example.com' }
     } */
  const user = await prisma.user.create({ data: req.body });
  res.status(201).json(user);
});

usersRouter.put("/:id", validateParamsId(), validateBody(updateUserSchema), async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Actualiza un usuario'
  const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: req.body });
  res.json(user);
});

usersRouter.delete("/:id", validateParamsId(), async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Elimina un usuario'
  await prisma.user.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});
