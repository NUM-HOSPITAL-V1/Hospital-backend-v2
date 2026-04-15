import Patient from "../../domain/models/Patient.model.js";
import ChronicDiseases from "../../domain/models/ChronicDiseases.model.js";

export const listAllPatients = async (filters = {}) => {
  return await Patient.find(filters);
};
export const findPatientById = async (id) => {
  return await Patient.findById(id).select("firstname lastname email phoneNumber sisiID customerId register gender birthOfDate");
};

export const findPatientByUserId = async (userId) => {
  return await Patient.findOne({ user: userId }).populate('user', 'firstName lastName fullName role');
};
export const createPatient = async (patientData) => {
  return await Patient.create(patientData);
};

export const updatePatientById = async (id, updateData) => {
  return await Patient.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

export const deletePatientById = async (id) => {
  return await Patient.findByIdAndDelete(id);
};



//CHRINIC DISEASE
export const createChronicDisease = async (diseaseData) => {
  return await ChronicDiseases.create(diseaseData);
};

export const findChronicDiseaseById = async (id) => {
  return await ChronicDiseases.findById(id);
};

export const updateChronicDiseaseById = async (id, updateData) => {
  return await ChronicDiseases.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

export const deleteChronicDiseaseById = async (id) => {
  return await ChronicDiseases.findByIdAndDelete(id);
};

export const listPatientChronicDiseases = async (patientId) => {
  return await ChronicDiseases.find({ patient: patientId })
    .sort({ diagnosisDate: -1 });
};
