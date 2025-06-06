import { Request, Response, NextFunction } from "express";
import { getAllUsers } from "@/repository/userRepository";

export const validateUniqueEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ ok: false, message: "📧 Email is required" });
  }
  const users = await getAllUsers();
  const exists = users.some((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ ok: false, message: "🚫 Email is already registered" });
  }
  next();
};
