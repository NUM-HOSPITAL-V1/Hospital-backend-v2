import { getCustomerById } from "../../infrastructure/clients/customerServiceClient.js";

const buildAddress = (customer = {}, fallback = "") => {
  const address = [
    customer.province,
    customer.district,
    customer.subdistrict,
    customer.addressDetail,
  ]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean)
    .join(", ");

  return address || fallback || "";
};

const mapProfessionToType = (profession = "", fallback = "Staff") => {
  const value = String(profession || "").trim().toUpperCase();
  if (value === "STUDENT") {
    return "Student";
  }

  if (value === "TEACHER") {
    return "Teacher";
  }

  return fallback || "Staff";
};

const mapCustomerOwnedFields = (patient, customer) => ({
  firstname: customer.firstName || patient.firstname,
  lastname: customer.surname || patient.lastname,
  email: customer.email || patient.email,
  phoneNumber: customer.phoneNumber || patient.phoneNumber,
  register: customer.nationalId || patient.register,
  address: buildAddress(customer, patient.address),
  occupation: customer.profession || patient.occupation,
  birthOfDate: customer.dateOfBirth || patient.birthOfDate,
  customerId: customer.customerId || patient.customerId,
  type: mapProfessionToType(customer.profession, patient.type),
  sisiID: customer.sisiId || patient.sisiID,
});

export const hydratePatientFromCustomerOwnership = async (patient) => {
  if (!patient) {
    return patient;
  }

  const plainPatient = typeof patient.toObject === "function" ? patient.toObject() : { ...patient };
  const customerId = plainPatient.customerId;

  if (!customerId) {
    return plainPatient;
  }

  try {
    const customer = await getCustomerById(customerId);
    return {
      ...plainPatient,
      ...mapCustomerOwnedFields(plainPatient, customer || {}),
    };
  } catch {
    return plainPatient;
  }
};

export const hydratePatientsFromCustomerOwnership = async (patients = []) => {
  return Promise.all(patients.map(hydratePatientFromCustomerOwnership));
};
