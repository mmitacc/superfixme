import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";

export const validateBody = (schema: ZodTypeAny): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Datos invalidos",
        details: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };
};

export const validateParamsId = (paramName = "id"): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = Number(req.params[paramName]);
    if (!Number.isInteger(value) || value < 0) {
      return res
        .status(400)
        .json({ error: `${paramName} debe ser un entero positivo` });
    }
    (req.params as Record<string, unknown>)[paramName] = value;
    next();
  };
};
