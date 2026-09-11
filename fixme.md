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
- En validate.ts, se encontro error en
order.routes.ts: res.status(204).send() debe ser status 201
order.routes.ts: data: { stock: { increment: item.quantity } }, debe ser decrement: item. quantity al ser una venta
order.routes.ts: está al revez el orden de el delete, primero es delete orderitem y luego delete order
order.routes.ts: el comentario de swagger menciona filtros pero no tiene filtros la funcion get /
