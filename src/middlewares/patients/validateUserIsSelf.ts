import { Request, Response, NextFunction } from "express";

export const validateUserIsSelf = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const { userId } = req.body;
  if (userId !== user.id) {
    return res.status(403).json({ ok: false, message: "You are not allowed to create or update data for another user." });
  }
  next();
};
