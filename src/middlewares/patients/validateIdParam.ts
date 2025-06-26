import { Request, Response, NextFunction } from "express";

/**
 * Middleware que valida que el parámetro :id esté presente, sea un número válido
 * y que coincida con el userId autenticado.
 * Si no es válido, responde con 400 y mensaje claro.
 * Si no coincide, responde con 403.
 * Asume que el parámetro se llama 'id' (ajusta si usas otro nombre en la ruta).
 */
export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const user = (req as any).user;
  if (!id || isNaN(id)) {
    return res.status(400).json({ ok: false, message: "id param is required and must be a valid number" });
  }
  if (user && id !== user.id) {
    return res.status(403).json({ ok: false, message: "You are not allowed to access or modify data for another user." });
  }
  next();
};
