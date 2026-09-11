en categorías el campo de validación esta opcional cuando deberia ser obligatorio según nuestra base de datos 
en la validación falto agregar trim ya que el usuario puede enviar un espacio y seria correcto según la validacion
en el swagger.ts funciona las rutas y colapsa se tiene que hacer para que apunte a una sola ruta "./src/app.ts" ahí distinguirá uno de otra 
agregar el min() para que después del trim se valide que el usuario envie como mínimo un caracter
en los comentarios de categoriesRouter.post los comentarios están mal ya que el body no es un parámetro y se tiene que cambiar a request.body para que funcione
falta los comentarios de swagger en categoriesRouter.put ya que en el swagger no puede hacer ningún cambio porque swagger no detecta el body enviado
falla en delegación de responsabilidades al tener gran parte de los endpoints en routes
en la validación de la categoría el createCategorySchema esta como opcional pero el update es un campo que es el name entonces si se actuliza y es opcional no tendría mucho sentido ya que no hay otro campo para modificar
en validateParamsId esta aceptando si mandamos un id 0 cuando los ids comienzan en 1 
en validateBody enviava al zod pero en uso de trim no aceptaba la transformaicon de zod y si creabamos "  mecanica   " se pasaba a la base tal cual sin aplicar el trim para eso se agrego req.body = result.data para que lo transformado por zod pase a la base de datos
- En validate.ts, se encontro error en
  productos
- el filtro de precio maximo no funciona aunque puse maxPrice=100 me siguen apareciendo productos que cuestan mas de 100
- el filtro minPrice no está funcionando Probe poniendo minPrice=100 pero igual me mostro productos que cuestan menos de 100
- el instock no funciona probe el filtro y me aparecen todos los productos sin importar si tienen stock
- el filtro categoryid no funciona porque el codigo usa category en vez de categoryid
  product schema
- el name del producto estaba como opcional en la validacion y se podia crear un producto sin nombre
- swagger no muestra el body del put de products
- Se agrego el archivo .env nuevo, ya que no se encontro en el py el modelo .env.example
- En schema.prisma, se cambio   provider = "postgresql"
- En src/lib/prisma.ts, todo para postgresql
- Se instalo: npm install -D typescript @types/node tsx
- En user.schema.ts, se debe quitar .optional() porque name, es un campo obligatorio.
- En user.schema.ts, en updateUserSchema, falto agregar .partial(), para que los campos sean opcionales para un update
- Falto agregar el archivo user.model.ts.
- En user.model.ts, falto agregar el metodo: findAll()
- En user.model.ts, falto agregar el metodo: findById()
- En user.model.ts, falto agregar el metodo: create()
- En user.model.ts, falto agregar el metodo: update()
- En user.model.ts, falto agregar el metodo: delete()
- Falto agregar el archivo user.controller.ts.
- En user.controller.ts, falto crear la función: getAll()
- En user.controller.ts, falto crear la función: getById()
- En user.controller.ts, falto crear la función: postUser()
- En user.controller.ts, falto crear la función: putUser()
- En user.controller.ts, falto crear la función: deleteUser()
- En user.routes.ts, cada uno de los endpoints, tienen multifuncionalidad y multiresponsabilidad, en contra del modelo/patron MVC/SVC, por lo que se restituya a su única función de Vista.
- En en el endpoint get("/"), restituido.
- En en el endpoint get("/:id"), restituido.
- En en el endpoint post("/"), restituido.
- En en el endpoint put("/:id"), restituido.
- En en el endpoint delete("/:id"), restituido.
- En swagger.ts, cambiar en endpointsFiles, todas las rutas por  "./src/app.ts"
- En user.routes.ts, en el endpoint post("/"), falto agregar en swageer.requestBody para openapi: "3.0.0"
- En user.routes.ts, en el endpoint put("/"), falto agregar en swageer.requestBody para openapi: "3.0.0"
- En user.routes.ts, en todos los endpoint se definio mal documentacion para swager, todos deben ser envueltos en /* ... */ (para que sean reconocidos)
- En user.schema.ts, en el campo email, se actualiza por: email: z.email("El email debe tener un formato correcto y es obligatorio")
- En validate.ts, se encontro error en
order.routes.ts: res.status(204).send() debe ser status 201
order.routes.ts: data: { stock: { increment: item.quantity } }, debe ser decrement: item. quantity al ser una venta
order.routes.ts: está al revez el orden de el delete, primero es delete orderitem y luego delete order
order.routes.ts: el comentario de swagger menciona filtros pero no tiene filtros la funcion get /
Bugs en archivos de productos:
* En  product.schema.ts se utiliza z.number() en price, por lo que solo se comprueba que el precio sea un número y se permiten valores negativos.
- Se utiliza z.number() en stock, por lo que no se valida que el stock sea un número entero (Int) ni que sea mayor o igual a 0.
- description es obligatorio en Zod, pero en schema.prisma está definido como opcional (String?), por lo que existe una diferencia entre las validaciones de ambos esquemas.
- updateProductSchema utiliza createProductSchema.partial(), por lo que hereda las mismas validaciones de price y stock. Si estas permiten valores inválidos, también se permiten al actualizar un producto.
* En products.controller.ts se utiliza Number(categoryId) sin comprobar si el resultado es NaN o si es un número decimal, por lo que se pueden recibir valores inválidos para categoryId.
- inStock interpreta cualquier valor diferente de "true" como false, por lo que valores inválidos como letras terminan comportándose como si se hubiera enviado false.
* En errorHandler.ts: el error P2025, que indica que el recurso que se intenta modificar o eliminar no existe, se devuelve como HTTP 400 en lugar de HTTP 404 que es el que correponde a NOT FOUND.
* En products.model.ts se utiliza any en filtros, por lo que se pierde el tipado de TypeScript al realizar las consultas de productos lo mismo pasa  datos:any (mala practica).

Bugs de Order 
* En order.routes.t al crear una orden se utiliza increment para actualizar el stock, por lo que el stock aumenta en lugar de disminuir según la cantidad de productos vendidos. 
* En order.schema.ts productId utiliza z.number(), por lo que permite números decimales y negativos aunque corresponde a un ID entero positivo.
- Tambien se usa quantity  z.number(), por lo que permite cantidades negativas, 0 y números decimales aunque la cantidad de productos debe ser un número entero positivo.
