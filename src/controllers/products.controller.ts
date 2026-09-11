import { Request, Response } from "express";

import {
  obtenerTodosLosProductos,
  obtenerProductoPorIdModelo,
  crearProductoModelo,
  actualizarProductoModelo,
  eliminarProductoModelo,
} from "../models/products.model.ts";

import { NotFoundError } from "../middleware/errorHandler.ts";

export const obtenerProductos = async (req: Request, res: Response) => {
  const { categoryId, minPrice, maxPrice, inStock } = req.query;

  const where: any = {};
  // Bug: Number(categoryId) puede devolver NaN o aceptar números decimales.
 
 if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (minPrice) {
    where.price = {
      ...where.price,
      gte: Number(minPrice),
    };
  }

  if (maxPrice) {
    where.price = {
      ...where.price,
      lte: Number(maxPrice),
    };
  }
  //// Bug: cualquier valor diferente de "true" se interpreta como false.
// Por ejemplo, ?inStock=abc termina buscando productos con stock 0.
// Solo se permiten los valores "true" y "false".

if (inStock !== undefined) {
    where.stock = inStock === "true" ? { gt: 0 } : { equals: 0 };
  }

  const productos = await obtenerTodosLosProductos(where);

  res.json(productos);
};

export const obtenerProductoPorId = async (req: Request, res: Response) => {
  const producto = await obtenerProductoPorIdModelo(Number(req.params.id));

  if (!producto) {
    throw new NotFoundError("Producto no encontrado");
  }

  res.json(producto);
};

export const crearProducto = async (req: Request, res: Response) => {
  const producto = await crearProductoModelo(req.body);

  res.status(201).json(producto);
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const producto = await actualizarProductoModelo(
    Number(req.params.id),
    req.body,
  );

  res.json(producto);
};

export const eliminarProducto = async (req: Request, res: Response) => {
  await eliminarProductoModelo(Number(req.params.id));

  res.status(204).send();
};
