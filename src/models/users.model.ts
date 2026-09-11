import { prisma } from "../lib/prisma";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "../validators/user.schema.ts";

const usersModel = {
  findAll: async () => {
    return await prisma.user.findMany({ orderBy: { id: "asc" } });
  },
  findById: async (id: number) => {
    return await prisma.user.findFirst({ where: { id } });
  },
  create: async (data: CreateUserInput) => {
    return await prisma.user.create({ data });
  },
  update: async (id: number, data: UpdateUserInput) => {
    return await prisma.user.update({ where: { id }, data });
  },
  delete: async (id: number) => {
    return await prisma.user.delete({ where: { id } });
  },
};

export default usersModel;
