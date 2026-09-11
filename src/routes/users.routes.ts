import { Router } from "express";
import { validateBody, validateParamsId } from "../middleware/validate.ts";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/user.schema.ts";
import {
  getAllUser,
  getByIdUser,
  postUser,
  putUser,
  deleteUser,
} from "../controllers/users.controller.ts";

export const usersRouter = Router();

usersRouter.get(
  "/",
  /*
  #swagger.tags = ['Users']
  #swagger.summary = 'Lista todos los usuarios
  */
  getAllUser,
);

usersRouter.get(
  "/:id",
  validateParamsId(),
  /*
  #swagger.tags = ['Users']
  #swagger.summary = 'Obtiene un usuario por id'
  */
  getByIdUser,
);

usersRouter.post(
  "/",
  validateBody(createUserSchema),
  /*
  #swagger.tags = ['Users']
  #swagger.summary = 'Crea un usuario'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "Ada Lovelace" },
            email: { type: "string", example: "ada@example.com" }
          },
          required: ["name", "email"]
        }
      }
    }
  }
  */
  postUser,
);

usersRouter.put(
  "/:id",
  validateParamsId(),
  validateBody(updateUserSchema),
  /*
  #swagger.tags = ['Users']
  #swagger.summary = 'Crea un usuario'
  #swagger.requestBody = {
    required: false,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string", example: "Ada Lovelace" },
            email: { type: "string", example: "ada@example.com" }
          },
        }
      }
    }
  }
  */
  putUser,
);

usersRouter.delete(
  "/:id",
  validateParamsId(),
  /*
  #swagger.tags = ['Users']
  #swagger.summary = 'Elimina un usuario'
  */
  deleteUser,
);
