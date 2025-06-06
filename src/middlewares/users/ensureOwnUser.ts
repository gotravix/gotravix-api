import { Request, Response, NextFunction } from "express";

// Middleware para garantizar que solo se consulten los datos del usuario autenticado
export function ensureOwnUser(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  const { id } = req.params;
  if (!user || !id) {
    return res.status(400).json({ ok: false, message: "User or id param missing" });
  }
  if (Number(id) !== user.id) {
    return res.status(403).json({ ok: false, message: "You can only access your own data" });
  }
  next();
}
