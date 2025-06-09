import { userRole } from "@/models/schemas";
import { Request, Response, NextFunction } from "express";

export const validateRoleNotEmpty = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.body;
  if (!role || typeof role !== "string") {
    return res.status(400).json({
      ok: false,
      message: "🚫 Role is required."
    });
  }
  // userRole.enumValues contiene los valores válidos
  const validRoles = userRole.enumValues;
  if (!validRoles.includes(role as any)) {
    return res.status(400).json({
      ok: false,
      message: `🚫 Invalid role. Allowed roles: ${validRoles.join(", ")}`
    });
  }
  next();
};
