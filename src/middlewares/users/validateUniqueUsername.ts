import { Request, Response, NextFunction } from "express";
import { getUserByUsername } from "@/repositories/db/userRepository";

/**
 * Middleware que valida que el username enviado en req.body sea único entre todos los usuarios,
 * permitiendo que el usuario actual conserve su propio username.
 */
export const validateUniqueUsername = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username;
  if (!username) return next(); // Si no se envía username, no valida

  const userId = Number(req.body.userId);
  if (!userId) {
    return res.status(400).json({ ok: false, message: "User ID is required for username uniqueness validation" });
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser && existingUser.id !== userId) {
    return res.status(400).json({ ok: false, message: "Username is already taken by another user" });
  }
  next();
};

