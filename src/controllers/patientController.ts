import { Request, Response } from "express";
import { getPatientByUserId, updatePatient, deletePatient } from "@/repositories/db/patientRepository";
import logger from "@/utils/logger";

export const getPatient = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    logger.warn("userId param is required", { params: req.params });
    return res.status(400).json({ ok: false, message: "userId param is required" });
  }
  const patient = await getPatientByUserId(userId);
  if (!patient) {
    logger.warn("Patient not found", { userId });
    return res.status(404).json({ ok: false, message: "Patient not found" });
  }
  logger.info("Patient retrieved", { userId });
  res.json({ ok: true, patient });
};

export const createPatientEndpoint = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { db } = await import("@/config/db");
  const { updateUser } = await import("@/repositories/db/userRepository");
  const { patientsSchema } = await import("@/models/schemas");
  try {
    await db.transaction(async (tx) => {
      const now = new Date();
      const updatedUser = await updateUser(userId, { wizard: true, username: req.body.username, updated_at: now  }, tx);
      if (!updatedUser) {
        logger.error("User not found when creating patient", { userId });
        throw new Error("User not found");
      }
      const patientData = {
        ...req.body,
        createdAt: now,
        updatedAt: now,
      };
      const [patient] = await tx.insert(patientsSchema).values(patientData).returning();
      if (!patient) {
        logger.error("Error creating patient in DB", { userId });
        throw new Error("Error creating patient");
      }
      const userPatient = {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        wizard: updatedUser.wizard,
        active: updatedUser.active,
        ...patient
      };
      logger.info("Patient created", { userId });
      res.status(201).json({ ok: true, user: userPatient });
    });
  } catch (error) {
    logger.error("Error creating patient", { error });
    res.status(500).json({ ok: false, message: "Error creating patient" });
  }
};

export const updatePatientEndpoint = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    logger.warn("userId param is required", { params: req.params });
    return res.status(400).json({ ok: false, message: "userId param is required" });
  }
  try {
    const updated = await updatePatient(userId, req.body);
    if (!updated) {
      logger.warn("Patient not found for update", { userId });
      return res.status(404).json({ ok: false, message: "Patient not found" });
    }
    logger.info("Patient updated", { userId });
    res.json({ ok: true, patient: updated });
  } catch (error) {
    logger.error("Error updating patient", { error });
    res.status(500).json({ ok: false, message: "Error updating patient" });
  }
};

export const deletePatientEndpoint = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    logger.warn("userId param is required", { params: req.params });
    return res.status(400).json({ ok: false, message: "userId param is required" });
  }
  try {
    const deleted = await deletePatient(userId);
    if (!deleted) {
      logger.warn("Patient not found for delete", { userId });
      return res.status(404).json({ ok: false, message: "Patient not found" });
    }
    logger.info("Patient deleted", { userId });
    res.json({ ok: true, patient: deleted });
  } catch (error) {
    logger.error("Error deleting patient", { error });
    res.status(500).json({ ok: false, message: "Error deleting patient" });
  }
};
