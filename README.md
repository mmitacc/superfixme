# Tienda API

API REST en **TypeScript** con Express 5, Prisma 7, Zod y Swagger (swagger-autogen + swagger-ui-express).

## Modelo de datos

5 tablas: `User`, `Category`, `Product`, `Order`, `OrderItem` (relaciones 1-N y N-N via OrderItem).

## Setup

```bash
npm install
npm run migrate   # crea/actualiza dev.db (SQLite) a partir de prisma/schema.prisma
npm run seed       # carga datos de ejemplo (3 usuarios, 2 categorias, 4 productos, 3 ordenes)
npm run swagger    # genera swagger-output.json a partir de los comentarios en las rutas
npm run dev         # levanta el servidor con recarga automatica (tsx watch)
npm run typecheck   # corre tsc --noEmit, solo chequea tipos (no compila a JS)
```

Servidor en http://localhost:3000 — documentacion interactiva en http://localhost:3000/api-docs

## Notas tecnicas

- Todo el codigo fuente es `.ts`. No hay paso de build: se ejecuta directo con
  `tsx` (via `npm run dev`/`npm run start`/`npm run seed`/`npm run swagger`),
  que transpila al vuelo con esbuild. `npm run typecheck` es el unico comando
  que corre el compilador de TypeScript de verdad (`tsc --noEmit`), para
  encontrar errores de tipos sin generar archivos.
- Prisma 7 exige un **driver adapter** explicito (no hay conexion implicita por URL). Se usa `@prisma/adapter-better-sqlite3`.
- El generator `prisma-client` (nuevo, reemplaza a `prisma-client-js`) emite TypeScript en `generated/prisma`, por lo que el proyecto corre con `tsx` en vez de `node` puro.
- La configuracion (datasource, ruta de migraciones, comando de seed) vive en `prisma7.config.ts`, no en `package.json`.
- Cada vez que cambies `prisma/schema.prisma`, corre `npm run migrate` y luego `npm run swagger` si cambiaste las rutas.

## Endpoints

- `GET/POST /api/users`, `GET/PUT/DELETE /api/users/:id`
- `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/:id`
- `GET/POST /api/products` (`?categoryId=` opcional), `GET/PUT/DELETE /api/products/:id`
- `GET/POST /api/orders`, `GET/DELETE /api/orders/:id`, `PATCH /api/orders/:id/status`
