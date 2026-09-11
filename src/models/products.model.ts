import { prisma } from "../lib/prisma.ts";
// Bug: se utiliza any en filtros, por lo no se puede comprobar si los datos enviados corresponden al tipo esperado.
export const obtenerTodosLosProductos = async (filtros: any) => {
  return prisma.product.findMany({
    where: filtros,
    include: {
      category: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

export const obtenerProductoPorIdModelo = async (id: number) => {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
};
// Bug: se utiliza any en datos, por lo que se pierde el tipado de TypeScript al crear o actualizar un producto.
export const crearProductoModelo = async (datos: any) => {
  return prisma.product.create({
    data: datos,
  });
};

export const actualizarProductoModelo = async (id: number, datos: any) => {
  return prisma.product.update({
    where: {
      id,
    },
    data: datos,
  });
};

export const eliminarProductoModelo = async (id: number) => {
  return prisma.product.delete({
    where: {
      id,
    },
  });
};
