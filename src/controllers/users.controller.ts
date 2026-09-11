import type { Request, Response } from "express";
import usersModel from "../models/users.model";
import { NotFoundError } from "../middleware/errorHandler";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await usersModel.findAll();
    return res.status(200).json({ total: users.length, data: users });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getByIdUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await usersModel.findById(id);
    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }
    return res
      .status(200)
      .json({ message: "Usuario encontrado exitosamente", data: user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = await usersModel.create(data);
    return res
      .status(200)
      .json({ message: "Usuario creado exitosamente", data: user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const putUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const user = await usersModel.update(id, data);
    return res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente", data: user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await usersModel.delete(id);
    return res
      .status(200)
      .json({ message: "Usuario eliminado exitosamente", data: user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
