import { Request, Response, NextFunction } from "express";

export const ensureUserIsPatient = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== 'patient') {
        return res.status(403).json({ ok: false, message: "Only users with the 'patient' role can create cases" });
    }
    next();
};
