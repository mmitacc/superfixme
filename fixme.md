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
Se encontraron los siguientes errores:
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
