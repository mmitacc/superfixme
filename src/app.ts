import express from "express";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "node:module";

import { usersRouter } from "./routes/users.routes.ts";
import { categoriesRouter } from "./routes/categories.routes.ts";
import { productsRouter } from "./routes/products.routes.ts";
import { ordersRouter } from "./routes/orders.routes.ts";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.ts";

const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger-output.json");

export const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({ message: "Tienda API viva. Ver documentacion en /api-docs" });
});

app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.use(notFoundHandler);
app.use(errorHandler);
