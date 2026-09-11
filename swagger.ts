import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Tienda API",
    description:
      "API REST de ejemplo: Users, Categories, Products, Orders y OrderItems",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000", description: "Servidor local" }],
  tags: [
    { name: "Users", description: "Gestion de usuarios" },
    { name: "Categories", description: "Gestion de categorias" },
    { name: "Products", description: "Gestion de productos" },
    { name: "Orders", description: "Gestion de ordenes" },
  ],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./src/app.ts",
  // "./src/routes/users.routes.ts",
  // "./src/routes/categories.routes.ts",
  // "./src/routes/products.routes.ts",
  // "./src/routes/orders.routes.ts",
];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
