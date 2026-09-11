Se encontraron los siguientes errores:
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