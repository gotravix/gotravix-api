import { Request, Response, NextFunction } from "express";
import { getPatientByUserId } from "@/repositories/db/patientRepository";

export const validatePatientNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  // Check if a patient already exists for this userId
  const patient = await getPatientByUserId(userId);
  if (patient) {
    return res.status(400).json({
      ok: false,
      message: "🩺 A patient record already exists for this user."
    });
  }
  next();
};
