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

productsRouter.post(
  "/",
  validateBody(createProductSchema),
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Crea un producto'
  // #swagger.parameters['body'] = {
  //   in: 'body',
  //   schema: {
  //     name: 'Teclado mecanico',
  //     description: 'Switches azules',
  //     price: 49.99,
  //     stock: 20,
  //     categoryId: 1
  //   }
  // }
  crearProducto,
);

productsRouter.put(
  "/:id",
  validateParamsId(),
  validateBody(updateProductSchema),
  actualizarProducto,
);

productsRouter.delete("/:id", validateParamsId(), eliminarProducto);
