import { Request, Response, NextFunction } from "express";
import { getPatientByUserId } from "@/repositories/db/patientRepository";

export const validatePatientUserId = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const { userId } = req.body;
  if (!user) {
    return res.status(404).json({
      ok: false,
      message: "❌ Authenticated user not found. Please log in again."
    });
  }
  if (user.role !== 'patient') {
    return res.status(403).json({
      ok: false,
      message: "🚫 Only users with the 'patient' role can perform this action."
    });
  }
  if (userId !== user.id) {
    return res.status(400).json({
      ok: false,
      message: "⚠️ The ID in the body must match your authenticated user id."
    });
  }
  // Check if a patient already exists for this userId
  const patient = await getPatientByUserId(user.id);
  if (patient) {
    return res.status(400).json({
      ok: false,
      message: "🩺 A patient record already exists for this user."
    });
  }
  next();
};
