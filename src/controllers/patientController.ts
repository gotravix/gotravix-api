import { Request, Response } from "express";
import { getPatientByUserId, updatePatient, deletePatient } from "../repository/patientRepository";

export const getPatient = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ ok: false, message: "userId param is required" });
  }
  const patient = await getPatientByUserId(userId);
  if (!patient) {
    return res.status(404).json({ ok: false, message: "Patient not found" });
  }
  res.json({ ok: true, patient });
};

export const createPatientEndpoint = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { db } = await import("../config/db");
  const { updateUser } = await import("../repository/userRepository");
  const { patientsSchema } = await import("../models/schemas");
  try {
    await db.transaction(async (tx) => {
      const now = new Date();
      // 1. Actualizar wizard a true y username
      const updatedUser = await updateUser(userId, { wizard: true, username: req.body.username, updated_at: now  }, tx);
      if (!updatedUser) {
        throw new Error("User not found");
      }
      // 2. Crear paciente con fechas
      
      const patientData = {
        ...req.body,
        createdAt: now,
        updatedAt: now,
      };
      const [patient] = await tx.insert(patientsSchema).values(patientData).returning();
      if (!patient) {
        throw new Error("Error creating patient");
      }
      // Unificar datos de user y patient en un solo objeto
      const userPatient = {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        wizard: updatedUser.wizard,
        active: updatedUser.active,
        ...patient
      };
      res.status(201).json({ ok: true, user: userPatient });
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error creating patient" });
  }
};

export const updatePatientEndpoint = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ ok: false, message: "userId param is required" });
  }
  try {
    const updated = await updatePatient(userId, req.body);
    if (!updated) {
      return res.status(404).json({ ok: false, message: "Patient not found" });
    }
    res.json({ ok: true, patient: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error updating patient" });
  }
};

export const deletePatientEndpoint = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res.status(400).json({ ok: false, message: "userId param is required" });
  }
  try {
    const deleted = await deletePatient(userId);
    if (!deleted) {
      return res.status(404).json({ ok: false, message: "Patient not found" });
    }
    res.json({ ok: true, patient: deleted });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error deleting patient" });
  }
};
