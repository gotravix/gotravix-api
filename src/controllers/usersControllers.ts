import { Request, Response } from "express";
import { getAllUsers } from '../repository/userRepository';


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
