import { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "@/repository/userRepository";

export const validateUserIsActive = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (user && !user.active) {
    return res.status(403).json({ ok: false, message: "🔒 User is not active" });
  }
  next();
};
