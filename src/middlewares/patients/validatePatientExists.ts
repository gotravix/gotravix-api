import { Request, Response, NextFunction } from "express";
import { getPatientByUserId } from "@/repositories/db/patientRepository";

export const validatePatientExists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.id);
  if (!userId) {
    return res.status(400).json({ ok: false, message: "id param is required" });
  }
  const patient = await getPatientByUserId(userId);
  if (!patient) {
    return res.status(404).json({ ok: false, message: "Patient not found" });
  }
  next();
};
