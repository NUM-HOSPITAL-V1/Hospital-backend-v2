import {
  createExamination,
  findExaminationById,
  updateExaminationById,
  deleteExaminationById,
  listAllExaminations,
  listPatientExaminations,
  listMedicalStaffExaminations,
} from "../../infrastructure/repositories/examinationRepository.js";
import { createError } from "../../utils/error.js";

export const createExaminationUseCases = () => {
  const addExamination = async (examinationData) => {
    const examId = Date.now();

    const examination = await createExamination({
      ...examinationData,
      exam_id: examId,
      exam_date: examinationData.exam_date || new Date(),
    });

    return examination;
  };

  const getExamination = async (id) => {
    const examination = await findExaminationById(id);
    if (!examination) {
      throw createError("Үзлэгийн мэдээлэл олдсонгүй!", 404);
    }
    return examination;
  };

  const updateExamination = async (id, updateData) => {
    const examination = await findExaminationById(id);
    if (!examination) {
      throw createError("Үзлэгийн мэдээлэл олдсонгүй!", 404);
    }

    // Check if staff can update this examination
    if (
      updateData.staffId &&
      examination.medicalStaff._id.toString() !== updateData.staffId
    ) {
      throw createError(
        "Зөвхөн өөрийн бүртгэсэн үзлэгийг засах боломжтой!",
        403
      );
    }

    // Remove staffId from update data as it's not a field in the model
    if (updateData.staffId) {
      delete updateData.staffId;
    }

    const updatedExamination = await updateExaminationById(id, updateData);
    return updatedExamination;
  };

  const removeExamination = async (id, staffId) => {
    const examination = await findExaminationById(id);
    if (!examination) {
      throw createError("Үзлэгийн мэдээлэл олдсонгүй!", 404);
    }

    // Ensure staff can only delete their own examinations
    if (examination.medicalStaff.id.toString() !== staffId) {
      throw createError(
        "Зөвхөн өөрийн бүртгэсэн үзлэгийг устгах боломжтой!",
        403
      );
    }

    await deleteExaminationById(id);
    return {
      success: true,
      message: "Үзлэгийн мэдээлэл амжилттай устгагдлаа!",
    };
  };

  const getPatientExaminations = async (patientId, filters = {}) => {
    const examinations = await listPatientExaminations(patientId, filters);
    return examinations;
  };

  const getAllExaminations = async (filters = {}) => {
    const examinations = await listAllExaminations(filters);
    return examinations;
  };

  const getMedicalStaffExaminations = async (staffId, filters = {}) => {
    const examinations = await listMedicalStaffExaminations(staffId, filters);
    return examinations;
  };

  return {
    addExamination,
    getExamination,
    updateExamination,
    removeExamination,
    getAllExaminations,
    getPatientExaminations,
    getMedicalStaffExaminations,
  };
};
