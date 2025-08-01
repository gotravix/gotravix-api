import { Request, Response, NextFunction } from "express";
import { getUserById } from "@/repositories/db/userRepository";
import { getPatientByUserId } from "@/repositories/db/patientRepository";
import { getClinicByUserId } from "@/repositories/db/clinicRepository";

export const validateCaseEntities = async (req: Request, res: Response, next: NextFunction) => {
    const { patientId, clinicId, lawyerId } = req.body;
    // Validar que el paciente exista
    const patient = await getPatientByUserId(Number(patientId));
    if (!patient) {
        return res.status(404).json({ ok: false, message: "Patient not found" });
    }
    // Validar que la clínica exista si se envía clinicId
    if (clinicId) {
        const clinic = await getClinicByUserId(Number(clinicId));
        if (!clinic) {
            return res.status(404).json({ ok: false, message: "Clinic not found" });
        }
    }
    // Validar que el abogado exista si se envía lawyerId
    if (lawyerId) {
        const lawyer = await getUserById(Number(lawyerId));
        if (!lawyer || lawyer.role !== 'lawyer') {
            return res.status(404).json({ ok: false, message: "Lawyer not found" });
        }
    }
    next();
};