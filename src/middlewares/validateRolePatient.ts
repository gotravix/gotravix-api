import { Request, Response, NextFunction } from "express";

// Este middleware verifica el rol directamente del JWT decodificado (req.user)
export const validateRolePatient = (req: Request, res: Response, next: NextFunction) => {
  // El usuario debe venir del JWT (req.user), que es asignado por validateJWT
  const user = (req as any).user;
  if (!user || user.role !== 'patient') {
    return res.status(403).json({ ok: false, message: 'Access allowed only for patient role (from JWT)' });
  }
  next();
};
