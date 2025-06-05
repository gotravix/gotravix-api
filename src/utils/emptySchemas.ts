// Utilidades para devolver objetos vacíos de Patient y Clinic
export function getEmptyPatient(userId: number) {
  return {
    userId,
    givenName: null,
    middleName: null,
    familyName: null,
    birthDate: null,
    phoneNumber: null,
    zipCode: null,
    state: null,
    city: null,
    address: null,
    createdAt: null,
    updatedAt: null,
  };
}

export function getEmptyClinic(userId: number) {
  return {
    userId,
    name: null,
    address: null,
    contactNumber: null,
    licenseNumber: null,
    createdAt: null,
    updatedAt: null,
  };
}
