import { Router } from "express";

import { validateBody, validateParamsId } from "../middleware/validate.ts";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.schema.ts";

import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/products.controller.ts";

export const productsRouter = Router();

productsRouter.get("/", obtenerProductos);

productsRouter.get("/:id", validateParamsId(), obtenerProductoPorId);

productsRouter.post("/", validateBody(createProductSchema), crearProducto);

productsRouter.put(
  "/:id",
  validateParamsId(),
  validateBody(updateProductSchema),
  actualizarProducto,
);

productsRouter.delete("/:id", validateParamsId(), eliminarProducto);
