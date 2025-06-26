import { Request, Response } from "express";
import { getPatientByUserId, updatePatient, deletePatient, createPatient } from "@/repositories/db/patientRepository";
import { updateUser } from "@/repositories/db/userRepository";
import logger from "@/utils/logger";
import { db } from "@/config/db";


export const createPatientEndpoint = async (req: Request, res: Response) => {
  const { userId, ...patientData } = req.body;
  try {
    await db.transaction(async (tx) => {
      const now = new Date();
      // Actualiza el usuario primero
      const updatedUser = await updateUser(userId, { wizard: true, username: req.body.username, updated_at: now }, tx);
      if (!updatedUser) {
        logger.warn("User not found for update", { userId });
        throw new Error("User not found");
      }
      // Crea el paciente usando el repositorio, ahora pasando tx para atomicidad
      const patient = await createPatient({ ...patientData, userId, createdAt: now, updatedAt: now }, tx);
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
      res.status(201).json({
        ok: true,
        message: "User created successfully.",
        user: userPatient
      });
    });
  } catch (error) {
    logger.error("Error creating patient", { error });
    res.status(500).json({ ok: false, message: "Error creating patient" });
  }
};

export const updatePatientEndpoint = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const patientData = req.body;
  try {
    await db.transaction(async (tx) => {
      const now = new Date();
      // Actualiza el usuario primero
      const updatedUser = await updateUser(userId, { username: patientData.username, updated_at: now }, tx);
      if (!updatedUser) {
        logger.warn("User not found for update", { userId });
        throw new Error("User not found");
      }
      // Actualiza el paciente usando el repositorio, pasando tx para atomicidad
      const updatedPatient = await updatePatient(userId, { ...patientData, updatedAt: now }, tx);
      const userPatient = {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        wizard: updatedUser.wizard,
        active: updatedUser.active,
        ...updatedPatient
      };
      logger.info("Patient updated", { userId });
      res.status(200).json({ ok: true, message: "User updated successfully.", user: userPatient });
    });
  } catch (error) {
    logger.error("Error updating patient", { error });
    res.status(500).json({ ok: false, message: "Error updating patient" });
  }
};
