import Examination from "../../domain/models/Examination.model.js";

//EXAMINATIONS
export const createExamination = async (examinationData) => {
  return await Examination.create(examinationData);
};

export const findExaminationById = async (id) => {
  return await Examination.findById(id)
    .populate("medicalStaff", "firstname lastname position specialization")
    .populate("patient", "firstname lastname register sisiID");
};

export const updateExaminationById = async (id, updateData) => {
  return await Examination.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("medicalStaff", "firstname lastname position specialization")
    .populate("patient", "firstname lastname register sisiID");
};

export const deleteExaminationById = async (id) => {
  return await Examination.findByIdAndDelete(id);
};

export const listPatientExaminations = async (patientId, filters = {}) => {
  const query = { patient: patientId, ...filters };

  return await Examination.find(query)
    .populate("medicalStaff", "firstname lastname position specialization")
    .sort({ exam_date: -1 }); // Sort by examination date, most recent first
};

export const listAllExaminations = async (filters = {}) => {
  return await Examination.find(filters)
    .populate("medicalStaff", "firstname lastname position specialization")
    .populate("patient", "firstname lastname register sisiID")
    .sort({ exam_date: -1 });
};

export const listMedicalStaffExaminations = async (staffId, filters = {}) => {
  const query = { medicalStaff: staffId, ...filters };

  return await Examination.find(query)
    .populate("patient", "firstname lastname register sisiID")
    .sort({ exam_date: -1 }); // Sort by examination date, most recent first
};
