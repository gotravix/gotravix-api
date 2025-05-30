import { Request, Response } from "express";
import bcrypt from "bcrypt";
import generarJWT from "../helpers/jwt";
import { createUser, getUserById, getAllUsers } from "../repository/userRepository";
import { NewUser } from "../models/schemas/user";

export const registrer = async (req: Request, res: Response) => {
  try {
    // Tomar los datos del body
    const { email, password } = req.body;

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario en la base de datos
    const newUser: NewUser = {
      email,
      password: hashedPassword,
    };
    const user = await createUser(newUser);

    // Responder con éxito
    res.status(201).json({
      ok: true,
      message: '🎉 User registered successfully',
      user: { id: user.id, email: user.email, created_at: user.created_at },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: '💥 Please contact the administrator',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const usuarios = await getAllUsers();
    const usuario = usuarios.find(
      (u) => u.email === email
    );

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        message: '❌ Incorrect username or password',
      });
    }

    // Verificar si la contraseña es correcta
    const validPassword = await bcrypt.compare(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: '❌ Incorrect username or password',
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id.toString(), usuario.email, usuario.email);

    res.status(200).json({
      ok: true,
      message: '✅ Login successful',
      id: usuario.id,
      email: usuario.email,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: '💥 Please contact the administrator',
    });
  }
};

