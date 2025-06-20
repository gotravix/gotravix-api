import { Request, Response, NextFunction } from "express";
import { getClinicByUserId } from "@/repositories/db/clinicRepository";

export const checkClinicExists = async (req: Request, res: Response, next: NextFunction) => {
    const { clinicId } = req.body;
    if (clinicId) {
        const clinic = await getClinicByUserId(Number(clinicId));
        if (!clinic) {
            return res.status(404).json({ ok: false, message: "Clinic not found" });
        }
    }
    next();
};
