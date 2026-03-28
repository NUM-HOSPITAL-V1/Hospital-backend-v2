// infrastructure/repositories/userRepository.js
import Patient from "../../domain/models/Patient.model.js";
import User from "../../domain/models/User.model.js";
import Admin from "../../domain/models/Admin.model.js";
import MedicalStaff from "../../domain/models/MedicalStaff.model.js";

export const createPatient = async (patientData) => {
  return await Patient.create(patientData);
};

export const createMedicalStaff = async (staffData) => {
  return await MedicalStaff.create(staffData);
};

export const createAdmin = async (adminData) => {
  return await Admin.create(adminData);
};
export const findUserByEmail = async (email) => {
  const baseUser = await User.findOne({ email });

  if (!baseUser) {
    return null;
  }

  if (baseUser.role === "MedicalStaff") {
    return await MedicalStaff.findById(baseUser._id);
  }

  if (baseUser.role === "Patient") {
    return await Patient.findById(baseUser._id);
  }

  if (baseUser.role === "Admin") {
    return await Admin.findById(baseUser._id);
  }

  return baseUser;
};
