import { Request, Response } from "express";
import { getUserById } from '@/repositories/db/userRepository';
import { buildUserDataFull } from "@/utils/buildUserData";
import logger from "@/utils/logger";

// Extiende el tipo Request para incluir user
interface AuthRequest extends Request {
  user?: {
    id: number | string;
    // Puedes agregar más propiedades si tu token las incluye
  };
}

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.user!;
    const user = await getUserById(Number(id));
    if (!user) {
      logger.warn("User not found", { id });
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const userData = await buildUserDataFull(user);

    logger.info("User retrieved", { id, role: user.role });
    return res.status(200).json({
      ok: true,
      message: "✅ User retrieved successfully",
      user: userData
    });
  } catch (error) {
    logger.error("Error retrieving user", { error });
    res.status(500).json({
      ok: false,
      message: '💥 Internal server error',
    });
  }
};

export const createUsers = (req: Request, res: Response) => {
  logger.info("Create user request", {
    query: req.query,
    body: req.body,
    params: req.params
  });
}

export const updateUsers = (req: Request, res: Response) => {
  logger.info("Update user request", {
    query: req.query,
    body: req.body,
    params: req.params
  });
}