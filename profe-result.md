# Profe.md — Guia del profesor (NO compartir con estudiantes)

Este documento es la respuesta correcta del ejercicio FIXME de la Tienda API.
El codigo entregado a los estudiantes **compila y arranca sin errores**, pero
tiene bugs intencionales repartidos en 4 frentes:

1. Validaciones con Zod (schemas incompletos o con errores de tipeo)
2. Filtros en los endpoints GET (faltantes o rotos)
3. Validacion de query params y body con Zod
4. Logica de Prisma (transacciones, filtros de error, relaciones)

No hay comentarios `// FIXME` en el codigo — es un bug hunt silencioso.
La idea es que el grupo (4-5 estudiantes) recorra el proyecto, escriba tests
o pruebe con Swagger/curl, y vaya encontrando y corrigiendo cada problema.

Total: **30 errores**. Abajo estan ordenados por archivo, con la linea
aproximada, que esta mal, y cual es el comportamiento/fix esperado.

---

## A. Validaciones con Zod (schemas)

### `src/validators/user.schema.ts`

1. **L5** — `email: z.string()` no valida formato de email. Cualquier string
   pasa (`"hola"` es un email valido para el schema). Falta `.email()`.
2. **L8** — `updateUserSchema = createUserSchema` ya no usa `.partial()`. Un
   `PUT /api/users/:id` que solo quiera cambiar el nombre falla porque exige
   tambien `email`. Fix: `createUserSchema.partial()`.
3. **L4** — `name` tiene `.optional()` agregado por error. Se puede crear un
   usuario sin nombre (Prisma tira una excepcion fea de "name is missing" en
   vez de un 400 claro de Zod). Fix: quitar `.optional()`.

### `src/validators/category.schema.ts`

4. **L4** — falta `.min(1, ...)` en `name`. Se puede crear una categoria con
   `name: ""`.
5. **L4** — `name` tiene `.optional()` agregado por error, mismo problema que
   el bug 3 pero en categorias.

### `src/validators/product.schema.ts`

6. **L4** — `name` es `.optional()` por error → producto sin nombre.
7. **L5** — `description` ahora es **requerido** (le falta `.optional()`).
   Esto es inconsistente con `schema.prisma`, donde `description` es
   `String?` (nullable). Un producto sin descripcion deberia poder crearse.
8. **L6** — `price` no tiene `.positive()`. Se pueden crear productos con
   precio `0` o negativo.
9. **L7** — `stock` perdio `.int().nonnegative().default(0)`. Consecuencias:
   acepta decimales (`stock: 2.5`), acepta negativos, y como ya no tiene
   default, si no se manda `stock` en el body, Prisma explota.
10. **L8** — `categoryId` perdio `.int().positive()`. Acepta `0`, negativos y
    decimales, que despues rompen la relacion con `Category` en Prisma.

### `src/validators/order.schema.ts`

11. **L3-4** — `productId` y `quantity` perdieron `.int().positive()`. Se
    puede pedir `quantity: -3` o `quantity: 0.5`.
12. **L8** — `userId` perdio `.int().positive()`.
13. **L9** — `items` perdio `.min(1, ...)`. Se puede crear una orden con
    `items: []` (una orden vacia, sin sentido de negocio).
14. **L14** — el enum de `status` tiene un typo: `"SHIPED"` en vez de
    `"SHIPPED"`. Nunca se puede hacer `PATCH /api/orders/:id/status` con
    `status: "SHIPPED"` (el valor "correcto" real), y ademas el valor del
    enum no coincide con lo que usa el seeder (`"SHIPPED"` en
    `prisma/seed.ts`).

---

## B. Validacion de body/params/query (middleware)

### `src/middleware/validate.ts`

15. **`validateBody`** — se elimino la linea `req.body = result.data;`. Zod
    parsea, coacciona tipos y aplica `default(...)`, pero el resultado nunca
    se usa: `req.body` sigue siendo el objeto crudo del cliente. Efecto
    practico: aunque arreglen el bug 9 (`stock.default(0)`), el default
    **nunca llega** a Prisma si no arreglan tambien este bug.
16. **`validateParamsId`** — la condicion paso de `value <= 0` a
    `value < 0`. Ahora `id = 0` pasa la validacion como "valido", y despues
    Prisma devuelve simplemente "no encontrado" en vez de que la API rechace
    el `0` como id invalido desde el request.
17. **Falta `validateQuery`** — no existe ninguna funcion para validar query
    params con Zod (a diferencia de `validateBody`/`validateParamsId`). Los
    estudiantes deben **crearla** (ej. `validateQuery(schema)`) y usarla en
    los endpoints GET que reciban filtros (`categoryId`, `minPrice`,
    `maxPrice`, `inStock`, `status`, `userId`, `search`, etc.), en vez de leer
    `req.query` crudo con `Number(...)` a mano.

---

## C. Filtros en los endpoints GET (faltantes o rotos)

### `src/routes/products.routes.ts`

18. **L12** — el codigo lee `req.query.category` pero la ruta/documentacion
    dice que el filtro es `?categoryId=`. Resultado: el filtro **nunca**
    filtra nada, pase lo que pase en la URL.
19. **L13** — `Number(category)` se manda directo a Prisma sin validar. Con
    `?categoryId=abc` (o cualquier no-numero), `Number("abc")` es `NaN`, y
    Prisma tira un error 500 feo en vez de un 400 claro. Se resuelve
    validando la query con Zod (ver bug 17) antes de llegar a Prisma.
20. **Falta filtro de rango de precio** — la lista de productos deberia
    soportar `?minPrice=` y `?maxPrice=` (con `price: { gte, lte }` en el
    `where` de Prisma). No esta implementado.
21. **Falta filtro `inStock`** — deberia soportar `?inStock=true` para
    traer solo productos con `stock > 0`. No esta implementado.

### `src/routes/users.routes.ts`

22. **Falta filtro de busqueda** — el listado de usuarios deberia soportar
    `?search=` para buscar por coincidencia parcial en `name` o `email`
    (`OR: [{ name: { contains } }, { email: { contains } }]`). No existe.

### `src/routes/categories.routes.ts`

23. **Falta el toggle `?withProducts=true`** — el listado de categorias
    siempre devuelve solo los campos planos. Deberia poder incluir sus
    productos cuando se pide `?withProducts=true` (usando `include`
    condicional).

### `src/routes/orders.routes.ts`

24. **Falta filtro por `status` y `userId`** — el listado de ordenes
    deberia soportar `?status=PAID` y/o `?userId=1` para filtrar. Hoy
    siempre devuelve todas las ordenes.

---

## D. Logica de Prisma

### `src/routes/orders.routes.ts`

25. **`stock: { increment: item.quantity }`** dentro de la transaccion de
    creacion de orden — deberia ser `decrement`. Tal como esta, **vender**
    un producto le **sube** el stock en vez de bajarlo.
26. **Se elimino el chequeo de stock insuficiente** (el `if (product.stock <
    item.quantity) throw ...` que existia antes de actualizar el stock). Se
    puede crear una orden pidiendo mas cantidad de la que hay disponible.
    Combinado con el bug 11 (quantity puede ser negativa) y el bug 25
    (increment en vez de decrement), el stock queda en un estado
    completamente inconsistente.
27. **Orden de operaciones invertido en la transaccion de `DELETE
    /api/orders/:id`** — el array de `$transaction([...])` borra primero
    `order.delete(...)` y despues `orderItem.deleteMany(...)`. Como
    `OrderItem` tiene una foreign key hacia `Order`, borrar la orden antes
    que sus items rompe la integridad referencial (dependiendo del motor,
    tira un error de constraint). El orden correcto es primero los items
    "hijos", despues el "padre".

### `src/middleware/errorHandler.ts`

28. **`P2002` (unique constraint) devuelve `500`** en vez de `409 Conflict`.
    Ejemplo: crear dos usuarios con el mismo email debería dar un 409 claro,
    no un 500 generico de "error interno".
29. **`P2025` (registro no encontrado en update/delete) devuelve `400`** en
    vez de `404 Not Found`. Ejemplo: hacer `PUT /api/users/9999` con un id
    que no existe deberia dar 404, no 400.
30. **Se elimino el manejo de `P2003` (foreign key constraint)**. Ejemplo:
    borrar una categoria que todavia tiene productos asociados (FK
    `Product.categoryId`) deberia devolver un `400` claro tipo "no se puede
    borrar, tiene productos asociados", pero ahora cae al `catch-all` y
    devuelve un `500` con el error crudo de Prisma.

---

## E. Como se manifiesta cada error (terminal vs status HTTP vs silencioso)

No todos los bugs "avisan" igual. Para guiar la correccion (y para explicarle
al grupo por que Swagger/Postman a veces no alcanza y hay que mirar la
terminal), los 30 se dividen en 3 tipos:

- 🖥️ **Terminal** — el server tira una excepcion no controlada por nuestros
  handlers especificos, cae al `catch-all` de `errorHandler.ts`, y se ve un
  `console.error(err)` con stack trace en la consola donde corre `npm run
  dev`, ademas de un `500` en la respuesta.
- 📡 **Status** — no hay stack trace en la terminal, pero el codigo HTTP de
  la respuesta es el incorrecto (o "casualmente correcto pero por la razon
  equivocada"). Se detecta mirando el status code en Postman/curl/Swagger.
- 🤫 **Silencioso** — la request responde `200`/`201` normalmente. El bug
  solo se nota si se revisa el **body de la respuesta** o se consulta la
  base de datos despues (con `prisma studio` o un `GET`).

| # | Bug | Como se manifiesta |
|---|-----|---------------------|
| 1 | email sin `.email()` | 🤫 Silencioso — crea el usuario igual |
| 2 | `updateUserSchema` sin `.partial()` | 📡 Status 400 en PUT parcial |
| 3 | `name` opcional en user | 🖥️ Terminal + 500 (Prisma: "Argument name is missing") |
| 4 | category `name` sin `.min(1)` | 🤫 Silencioso — crea categoria con `""` |
| 5 | category `name` opcional | 🖥️ Terminal + 500 (mismo caso que el 3) |
| 6 | product `name` opcional | 🖥️ Terminal + 500 (mismo caso que el 3) |
| 7 | product `description` requerido | 📡 Status 400 si no se manda descripcion |
| 8 | `price` sin `.positive()` | 🤫 Silencioso — precio 0 o negativo |
| 9 | `stock` sin default/constraints | 📡 Status 400 si se omite (ya no hay default) **o** 🤫 Silencioso si se manda negativo |
| 10 | `categoryId` sin `.int().positive()` | 🖥️ Terminal + 500 si el id no existe (depende del bug 30) |
| 11 | `productId`/`quantity` sin constraints | 🤫 Silencioso — cantidades negativas/decimales |
| 12 | `userId` sin constraints | 📡 Status 404 (compensado por el `NotFoundError` de la ruta) |
| 13 | `items` sin `.min(1)` | 🤫 Silencioso — orden vacia, `201` igual |
| 14 | typo `"SHIPED"` en enum | 📡 Status 400 al mandar el valor real `"SHIPPED"` |
| 15 | `validateBody` no reasigna `req.body` | 🤫 Silencioso — defaults/coerciones de Zod se ignoran |
| 16 | `validateParamsId` acepta `id = 0` | 📡 Status 404 (compensado, pero por la razon equivocada) |
| 17 | falta `validateQuery` | — (habilita los bugs 19 y los de la seccion C) |
| 18 | lee `req.query.category` en vez de `categoryId` | 🤫 Silencioso — el filtro nunca filtra |
| 19 | `Number(category)` sin validar | 🖥️ Terminal + 500 con `?category=abc` (NaN a Prisma) |
| 20-24 | filtros faltantes (precio, stock, search, withProducts, status/userId) | 🤫 Silencioso — responde `200` con la lista completa, sin filtrar |
| 25 | `increment` en vez de `decrement` | 🤫 Silencioso — solo se nota revisando el `stock` del producto despues |
| 26 | falta chequeo de stock insuficiente | 🤫 Silencioso — permite sobrevender |
| 27 | orden invertido en `$transaction` del DELETE | 🖥️ Terminal + 500 (P2003, foreign key) — depende del bug 30 |
| 28 | `P2002` devuelve 500 | 📡 Status (sin stack trace, es un branch nuestro) |
| 29 | `P2025` devuelve 400 | 📡 Status (sin stack trace, es un branch nuestro) |
| 30 | falta manejo de `P2003` | 🖥️ Terminal + 500 — afecta a los bugs 10 y 27, y a borrar una categoria con productos |

**Para arrancar rapido:** los bugs 🖥️ (3, 5, 6, 10, 19, 27, 30) son los que
mas facil van a notar apenas prueben la API a mano, porque el server
literalmente tira un stack trace en la consola de `npm run dev`. Los 🤫
silenciosos (la mayoria) son los que realmente ponen a prueba si el grupo
esta *probando* la API con cuidado (revisando el body, comparando contra lo
esperado) y no solo mirando si "no explota".

---

## Notas para corregir el ejercicio

- Los bugs 1-3, 4-5, 6-10 y 11-14 siguen el **mismo patron repetido** en
  distintos archivos (falta una constraint de Zod, o se agrego `.optional()`
  por error). Si un grupo detecta el patron en un archivo, deberia revisar
  los demas validators buscando el mismo tipo de error — es intencional,
  para premiar a los grupos que generalizan el aprendizaje en vez de
  parchar caso por caso.
- Los bugs 20, 21, 22, 23 y 24 no son "arreglar una linea rota": son
  **features pedidas que no estan implementadas**. Evaluar que además de
  agregarlas, validen los query params correspondientes con Zod (bug 17).
- Buen indicador de que un grupo entendio el bug 15 (`validateBody` no
  reasigna `req.body`): si arreglan el default de `stock` (bug 9) pero
  igual falla al no mandar `stock`, es porque no vieron el bug 15 todavia.
- El bug 27 (orden de la transaccion) es el mas "avanzado" — requiere
  entender que Prisma ejecuta el array de `$transaction` en orden y que las
  foreign keys importan incluso dentro de una transaccion.
