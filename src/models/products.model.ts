import { prisma } from "../lib/prisma.ts";

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
