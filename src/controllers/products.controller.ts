import { Request, Response } from "express";

import {
  obtenerTodosLosProductos,
  obtenerProductoPorIdModelo,
  crearProductoModelo,
  actualizarProductoModelo,
  eliminarProductoModelo,
} from "../models/products.model.ts";

import { NotFoundError } from "../middleware/errorHandler.ts";

export const obtenerProductos = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Obtiene todos los productos'
     #swagger.description = 'Obtiene la lista de productos y permite filtrar por categoria precio y stock'

     #swagger.parameters['categoryId'] = {
       in: 'query',
       description: 'Filtra los productos por ID de categoria',
       required: false,
       type: 'integer',
       example: 1
     }

     #swagger.parameters['minPrice'] = {
       in: 'query',
       description: 'Precio minimo de los productos',
       required: false,
       type: 'number',
       example: 10
     }

     #swagger.parameters['maxPrice'] = {
       in: 'query',
       description: 'Precio maximo de los productos',
       required: false,
       type: 'number',
       example: 100
     }

     #swagger.parameters['inStock'] = {
       in: 'query',
       description: 'Filtra productos que tienen stock',
       required: false,
       type: 'boolean',
       example: true
     }

     #swagger.responses[200] = {
       description: 'Lista de productos obtenida correctamente'
     }

     #swagger.responses[400] = {
       description: 'Parametros de busqueda invalidos'
     }
  */

  const { categoryId, minPrice, maxPrice, inStock } = req.query;

  const where: any = {};
  // Bug: Number(categoryId) puede devolver NaN o aceptar números decimales.
 
 if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (minPrice) {
    where.price = {
      ...where.price,
      gte: Number(minPrice),
    };
  }

  if (maxPrice) {
    where.price = {
      ...where.price,
      lte: Number(maxPrice),
    };
  }
  //// Bug: cualquier valor diferente de "true" se interpreta como false.
// Por ejemplo, ?inStock=abc termina buscando productos con stock 0.
// Solo se permiten los valores "true" y "false".

if (inStock !== undefined) {
    where.stock = inStock === "true" ? { gt: 0 } : { equals: 0 };
  }

  const productos = await obtenerTodosLosProductos(where);

  res.json(productos);
};

export const obtenerProductoPorId = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Obtiene un producto por ID'
     #swagger.description = 'Busca un producto especifico mediante su ID'

     #swagger.parameters['id'] = {
       in: 'path',
       description: 'ID del producto',
       required: true,
       type: 'integer',
       example: 1
     }

     #swagger.responses[200] = {
       description: 'Producto encontrado correctamente'
     }

     #swagger.responses[400] = {
       description: 'ID invalido'
     }

     #swagger.responses[404] = {
       description: 'Producto no encontrado'
     }
  */

  const producto = await obtenerProductoPorIdModelo(Number(req.params.id));

  if (!producto) {
    throw new NotFoundError("Producto no encontrado");
  }

  res.json(producto);
};

export const crearProducto = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Crea un producto'
     #swagger.description = 'Registra un nuevo producto'

     #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: {
             type: 'object',
             required: [
               'name',
               'description',
               'price',
               'stock',
               'categoryId'
             ],
             properties: {
               name: {
                 type: 'string',
                 example: 'Mouse gamer'
               },
               description: {
                 type: 'string',
                 example: 'Mouse optico de prueba'
               },
               price: {
                 type: 'number',
                 example: 50
               },
               stock: {
                 type: 'integer',
                 example: 10
               },
               categoryId: {
                 type: 'integer',
                 example: 1
               }
             }
           }
         }
       }
     }

     #swagger.responses[201] = {
       description: 'Producto creado correctamente'
     }

     #swagger.responses[400] = {
       description: 'Datos invalidos'
     }
  */

  const producto = await crearProductoModelo(req.body);

  res.status(201).json(producto);
};

export const actualizarProducto = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Actualiza un producto'
     #swagger.description = 'Actualiza los datos de un producto existente'

     #swagger.parameters['id'] = {
       in: 'path',
       description: 'ID del producto que se desea actualizar',
       required: true,
       type: 'integer',
       example: 1
     }

     #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: {
             type: 'object',
             properties: {
               name: {
                 type: 'string',
                 example: 'Teclado mecanico'
               },
               description: {
                 type: 'string',
                 example: 'Switches rojos'
               },
               price: {
                 type: 'number',
                 example: 59.99
               },
               stock: {
                 type: 'integer',
                 example: 15
               },
               categoryId: {
                 type: 'integer',
                 example: 1
               }
             }
           }
         }
       }
     }

     #swagger.responses[200] = {
       description: 'Producto actualizado correctamente'
     }

     #swagger.responses[400] = {
       description: 'Datos o ID invalidos'
     }

     #swagger.responses[404] = {
       description: 'Producto no encontrado'
     }
  */

  const producto = await actualizarProductoModelo(
    Number(req.params.id),
    req.body,
  );

  res.json(producto);
};

export const eliminarProducto = async (req: Request, res: Response) => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Elimina un producto'
     #swagger.description = 'Elimina un producto mediante su ID'

     #swagger.parameters['id'] = {
       in: 'path',
       description: 'ID del producto que se desea eliminar',
       required: true,
       type: 'integer',
       example: 4
     }

     #swagger.responses[204] = {
       description: 'Producto eliminado correctamente'
     }

     #swagger.responses[400] = {
       description: 'ID invalido'
     }

     #swagger.responses[404] = {
       description: 'Producto no encontrado'
     }
  */

  await eliminarProductoModelo(Number(req.params.id));

  res.status(204).send();
};
