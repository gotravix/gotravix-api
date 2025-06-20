import { Request, Response, NextFunction } from "express";
import { getUserById } from "@/repositories/db/userRepository";

export const checkLawyerExists = async (req: Request, res: Response, next: NextFunction) => {
    const { lawyerId } = req.body;
    if (lawyerId) {
        const lawyer = await getUserById(Number(lawyerId));
        if (!lawyer || lawyer.role !== 'lawyer') {
            return res.status(404).json({ ok: false, message: "Lawyer not found" });
        }
    }
    next();
};
