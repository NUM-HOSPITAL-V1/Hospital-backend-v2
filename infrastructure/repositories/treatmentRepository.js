import Treatment from "../../domain/models/Treatment.model.js";

// Treatment Repository
export const createTreatment = async (treatmentData) => {
  return await Treatment.create(treatmentData);
};

export const findTreatmentById = async (id) => {
  return await Treatment.findById(id)
    .populate("examination_id", "exam_date doctors_examination exam_type surgery illness reason status")
    .populate("patient", "firstname lastname register sisiID")
    .populate("medicalStaff", "firstname lastname position specialization");
};

export const updateTreatmentById = async (id, updateData) => {
  return await Treatment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("examination_id", "exam_date doctors_examination exam_type surgery illness reason status")
    .populate("patient", "firstname lastname register sisiID")
    .populate("medicalStaff", "firstname lastname position specialization");
};

export const deleteTreatmentById = async (id) => {
  return await Treatment.findByIdAndDelete(id);
};

export const listAllTreatments = async () => {
  return await Treatment.find()
    .populate("examination_id", "exam_date doctors_examination exam_type surgery illness reason status")
    .populate("patient", "firstname lastname register sisiID")
    .populate("medicalStaff", "firstname lastname position specialization")
    .sort({ date: -1 }); // Sort by date, most recent first
};

export const listPatientTreatments = async (patientId) => {
  return await Treatment.find({ patient: patientId })
    .populate("examination_id", "exam_date doctors_examination exam_type surgery illness reason status")
    .populate("medicalStaff", "firstname lastname position specialization")
    .sort({ date: -1 }); // Sort by date, most recent first
};

export const listMedicalStaffTreatments = async (staffId) => {
  return await Treatment.find({ medicalStaff: staffId })
    .populate("examination_id", "exam_date doctors_examination exam_type surgery illness reason status")
    .populate("patient", "firstname lastname register sisiID")
    .sort({ date: -1 }); // Sort by date, most recent first
};

export const listTreatmentsByExamination = async (examinationId) => {
  return await Treatment.find({ examination_id: examinationId })
    .populate("patient", "firstname lastname register sisiID")
    .populate("medicalStaff", "firstname lastname position specialization")
    .sort({ date: -1 });
};

export const listTreatmentsByType = async (treatmentType) => {
  return await Treatment.find({ treatmentType })
    .populate("examination_id", "exam_date doctors_examination exam_type surgery illness reason status")
    .populate("patient", "firstname lastname register sisiID")
    .populate("medicalStaff", "firstname lastname position specialization")
    .sort({ date: -1 });
};

export const listTreatmentsByDateRange = async (startDate, endDate) => {
  return await Treatment.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .populate("examination_id", "exam_date doctors_examination exam_type surgery illness reason status")
    .populate("patient", "firstname lastname register sisiID")
    .populate("medicalStaff", "firstname lastname position specialization")
    .sort({ date: -1 });
};
