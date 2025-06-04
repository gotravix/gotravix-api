import { Request, Response } from "express";
import { getPatientByUserId, createPatient, updatePatient, deletePatient } from "../repository/patientRepository";

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
  try {
    const patient = await createPatient(req.body);
    res.status(201).json({ ok: true, patient });
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
