Se encontraron los siguientes errores:
- En validate.ts, se encontro error en
order.routes.ts: res.status(204).send() debe ser status 201
order.routes.ts: data: { stock: { increment: item.quantity } }, debe ser decrement: item. quantity al ser una venta
order.routes.ts: está al revez el orden de el delete, primero es delete orderitem y luego delete order
order.routes.ts: el comentario de swagger menciona filtros pero no tiene filtros la funcion get /