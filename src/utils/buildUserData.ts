import { getPatientByUserId } from "@/repositories/db/patientRepository";
import { getClinicByUserId } from "@/repositories/db/clinicRepository";
import { getEmptyPatient, getEmptyClinic } from "@/utils/emptySchemas";

export async function buildUserData(usuario: any) {
  let userData: any = {
    id: usuario.id,
    email: usuario.email,
    username: usuario.username,
    role: usuario.role,
    wizard: usuario.wizard,
  };
  if (usuario.role === 'patient') {
    const patient = await getPatientByUserId(usuario.id);
    userData = { ...userData, ...(patient ? patient : getEmptyPatient(usuario.id)) };
  } else if (usuario.role === 'clinic') {
    const clinic = await getClinicByUserId(usuario.id);
    userData = { ...userData, ...(clinic ? clinic : getEmptyClinic(usuario.id)) };
  }
  return userData;
}



export async function buildUserDataFull(usuario: any) {
  let userData: any = {
    id: usuario.id,
    email: usuario.email,
    username: usuario.username,
    role: usuario.role,
    wizard: usuario.wizard,
  };
  if (usuario.role === 'patient') {
    const patient = await getPatientByUserId(usuario.id);
    if (patient) userData = { ...userData, ...patient };
  } else if (usuario.role === 'clinic') {
    const clinic = await getClinicByUserId(usuario.id);
    if (clinic) userData = { ...userData, ...clinic };
  }
  return userData;
}