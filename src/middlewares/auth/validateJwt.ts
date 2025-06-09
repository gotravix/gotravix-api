import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "@/repository/userRepository";
import { JWT_SECRET } from "@/constants/env";

interface UsuarioToken {
  id: string;
  username: string;
  email: string;
}

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  // x-token headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "🔒 No token provided in the request",
    });
  }

  try {
    // Verify and get the id from the token
    const { id } = jwt.verify(token, JWT_SECRET) as UsuarioToken;
    // Get the user from the database using Drizzle
    const user = await getUserById(Number(id));
    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "🚫 User does not exist",
      });
    }

    // Check if the user is active
    if (!user.active) {
      return res.status(401).json({
        ok: false,
        message: "🔒 User is not active",
      });
    }

    // Attach user to the request for next middlewares
    (req as any).user = user;

    // Continue to the next middleware
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        message: '❌ Token expired. Please log in again.',
      });
    }
    console.log(error);
    return res.status(401).json({
      ok: false,
      message: '❌ Invalid token',
    });
  }
};
