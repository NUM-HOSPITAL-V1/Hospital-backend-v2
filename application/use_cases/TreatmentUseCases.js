import {
    createTreatment,
    findTreatmentById,
    updateTreatmentById,
    deleteTreatmentById,
    listAllTreatments,
    listPatientTreatments,
    listMedicalStaffTreatments,
    listTreatmentsByExamination,
    listTreatmentsByType,
    listTreatmentsByDateRange
  } from "../../infrastructure/repositories/treatmentRepository.js";
  import { findMedicalStaffById } from "../../infrastructure/repositories/medicalStaffRepository.js";
  import { createError } from "../../utils/error.js";
  
  // TREATMENT
  export const createTreatmentUseCases = () => {
    const addTreatment = async (treatmentData) => {
      const treatment = await createTreatment({
        ...treatmentData,
        date: treatmentData.date || new Date(),
        sessionsCompleted: treatmentData.sessionsCompleted || 0
      });
  
      return treatment;
    };
  
    const getTreatment = async (id) => {
      const treatment = await findTreatmentById(id);
      if (!treatment) {
        throw createError("Эмчилгээний мэдээлэл олдсонгүй!", 404);
      }
      return treatment;
    };
  
    const updateTreatment = async (id, updateData) => {
      const treatment = await findTreatmentById(id);
      if (!treatment) {
        throw createError("Эмчилгээний мэдээлэл олдсонгүй!", 404);
      }

      const requesterRole = updateData.requesterRole;
      let requester = null;
      if (updateData.staffId && requesterRole === "MedicalStaff") {
        requester = await findMedicalStaffById(updateData.staffId);
        if (!requester) {
          throw createError("Ажилтны мэдээлэл олдсонгүй!", 404);
        }
      }

      const isAdmin = requesterRole === "Admin";
      const isOwner =
        updateData.staffId &&
        treatment.medicalStaff._id.toString() === updateData.staffId;

      const isNurseProgressUpdate =
        requester?.position === "Nurse" &&
        Object.keys(updateData).every((key) => ["staffId", "requesterRole", "sessionsCompleted"].includes(key));

      // Admin can update any treatment. Owners can edit their own treatment.
      // Nurses can only update execution progress.
      if (updateData.staffId && !isAdmin && !isOwner && !isNurseProgressUpdate) {
        throw createError("Зөвхөн өөрийн бичсэн эмчилгээний мэдээллийг засах боломжтой!", 403);
      }

      if (
        typeof updateData.sessionsCompleted === "number" &&
        typeof treatment.totalQuantity === "number" &&
        updateData.sessionsCompleted > treatment.totalQuantity
      ) {
        throw createError("Хийгдсэн эмчилгээний тоо нийт тооноос их байж болохгүй!", 400);
      }

      if (updateData.staffId) {
        delete updateData.staffId;
      }
      if (updateData.requesterRole) {
        delete updateData.requesterRole;
      }
  
      const updatedTreatment = await updateTreatmentById(id, updateData);
      return updatedTreatment;
    };
  
    const removeTreatment = async (id, staffId) => {
      const treatment = await findTreatmentById(id);
      if (!treatment) {
        throw createError("Эмчилгээний мэдээлэл олдсонгүй!", 404);
      }
  
      // Ensure staff can only delete their own treatments
      if (treatment.medicalStaff._id.toString() !== staffId) {
        throw createError("Зөвхөн өөрийн бичсэн эмчилгээний мэдээллийг устгах боломжтой!", 403);
      }
  
      await deleteTreatmentById(id);
      return { success: true, message: "Эмчилгээний мэдээлэл амжилттай устгагдлаа!" };
    };
  
    const getAllTreatments = async () => {
      const treatments = await listAllTreatments();
      return treatments;
    };
  
    const getPatientTreatments = async (patientId) => {
      const treatments = await listPatientTreatments(patientId);
      return treatments;
    };
  
    const getMedicalStaffTreatments = async (staffId) => {
      const treatments = await listMedicalStaffTreatments(staffId);
      return treatments;
    };
  
    const getTreatmentsByExamination = async (examinationId) => {
      const treatments = await listTreatmentsByExamination(examinationId);
      return treatments;
    };
  
    const getTreatmentsByType = async (treatmentType) => {
      const treatments = await listTreatmentsByType(treatmentType);
      return treatments;
    };
  
    const getTreatmentsByDateRange = async (startDate, endDate) => {
      const treatments = await listTreatmentsByDateRange(startDate, endDate);
      return treatments;
    };
  
    return {
      addTreatment,
      getTreatment,
      updateTreatment,
      removeTreatment,
      getAllTreatments,
      getPatientTreatments,
      getMedicalStaffTreatments,
      getTreatmentsByExamination,
      getTreatmentsByType,
      getTreatmentsByDateRange
    };
  };
