import { Request, Response } from "express";
import logger from "@/utils/logger";
import { createCase as createCaseRepo } from "@/repositories/db/caseRepository";

// Controlador para crear un nuevo caso
export const createCase = async (req: Request, res: Response) => {
    try {
        const { title, patientId, clinicId, lawyerId, description } = req.body;
        const newCase = await createCaseRepo({
            title,
            patientId,
            clinicId,
            lawyerId,
            description,
        });
        logger.info("Case created", { case: newCase });
        return res.status(201).json({
            ok: true,
            message: "✅ Case created successfully",
            case: newCase
        });
    } catch (error) {
        logger.error("Error creating case", { error });
        return res.status(500).json({
            ok: false,
            message: "💥 Internal server error"
        });
    }
};
