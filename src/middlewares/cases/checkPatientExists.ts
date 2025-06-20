import { Request, Response, NextFunction } from "express";
import { getPatientByUserId } from "@/repositories/db/patientRepository";

export const checkPatientExists = async (req: Request, res: Response, next: NextFunction) => {
    // Si tienes el usuario autenticado en req.user, úsalo
    const user = (req as any).user;
    const patientId = user?.id || req.body.patientId;
    const patient = await getPatientByUserId(Number(patientId));
    if (!patient) {
        return res.status(404).json({ ok: false, message: "Patient not found" });
    }
    next();
};
