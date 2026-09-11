import type { NextFunction, Request, Response } from "express";

export class NotFoundError extends Error {
  constructor(message = "Recurso no encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.name === "NotFoundError") {
    return res.status(404).json({ error: err.message });
  }

  if (err.name === "InsufficientStockError") {
    return res.status(409).json({ error: err.message });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      return res.status(500).json({
        error: "Ya existe un registro con ese valor unico",
        target: err.meta?.target,
      });
    }
    // Bug: P2025 indica que el recurso que se intenta modificar o eliminar no existe.
   // Actualmente devuelve 400, pero corresponde devolver 404 Not Found.
    if (err.code === "P2025") {
      return res.status(400).json({ error: "Recurso no encontrado" });
    }
  }

  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
