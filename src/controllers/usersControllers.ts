import { Request, Response } from "express";
import { createUser, getAllUsers, updateUser } from '../repository/userRepository';
import z from "zod";


export const getUsers = async (req: Request, res: Response) => {
  try {
    // Obtener todos los usuarios excluyendo la contraseña
    const usuarios = await getAllUsers();
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.status(200).json({
      ok: true,
      message: '📋 Users retrieved successfully',
      usuarios: usuariosSinPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: '💥 Internal server error',
    });
  }
};


export const createUsers = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await createUser(userData);
    // Exclude password from response if present
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json({
      ok: true,
      message: "✅ User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "💥 Internal server error",
    });
  }
};

export const updateUsers = async (req: Request, res: Response) => {
  try {
    const userId = z
      .number()
      .parse(req.params.id);
    const updateData = req.body;
    const updatedUser = await updateUser(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      ok: true,
      message: "✅ User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "💥 Internal server error",
    });
  }
};