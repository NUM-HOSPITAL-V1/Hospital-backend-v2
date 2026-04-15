import Patient from "../../domain/models/Patient.model.js";

const normalizePatientType = (profession = "") => {
  const value = String(profession || "").trim().toUpperCase();

  if (value === "STUDENT") {
    return "Student";
  }

  if (value === "TEACHER") {
    return "Teacher";
  }

  return "Staff";
};

const normalizeGender = (gender = "") => {
  const value = String(gender || "").trim().toLowerCase();
  if (value === "male" || value === "эрэгтэй") {
    return "male";
  }

  if (value === "female" || value === "эмэгтэй") {
    return "female";
  }

  return undefined;
};

const buildAddress = (customer = {}) => {
  return [
    customer.province,
    customer.district,
    customer.subdistrict,
    customer.addressDetail,
  ]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean)
    .join(", ");
};

export const mapCustomerProfileToPatientShadow = (customer = {}, extras = {}) => ({
  firstname: customer.firstName || extras.firstname || "",
  lastname: customer.surname || extras.lastname || "",
  email: customer.email || extras.email || "",
  phoneNumber: customer.phoneNumber || extras.phoneNumber || "",
  customerId: customer.customerId || extras.customerId || "",
  register: customer.nationalId || extras.register || "",
  address: buildAddress(customer) || extras.address || "",
  occupation: customer.profession || extras.occupation || "",
  birthOfDate: customer.dateOfBirth || extras.birthOfDate || undefined,
  gender: normalizeGender(customer.gender) || extras.gender,
  type: extras.type || normalizePatientType(customer.profession),
  sisiID: customer.sisiId || extras.sisiID || "",
  school: extras.school,
  education: extras.education,
});

export const syncPatientShadowByCustomerId = async (customer = {}) => {
  const customerId = customer.customerId;
  if (!customerId) {
    return null;
  }

  const shadowUpdate = mapCustomerProfileToPatientShadow(customer);

  return Patient.findOneAndUpdate(
    { customerId },
    { $set: shadowUpdate },
    { new: true, runValidators: true }
  );
};
