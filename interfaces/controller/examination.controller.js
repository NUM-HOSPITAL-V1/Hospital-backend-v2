import { createExaminationUseCases } from "../../application/use_cases/examinationUseCases.js";

const {
  addExamination,
  getExamination,
  updateExamination,
  removeExamination,
  getAllExaminations,
  getPatientExaminations,
  getMedicalStaffExaminations,
} = createExaminationUseCases();

import {
  examinationSchema,
  examinationUpdateSchema,
} from "../../utils/validators.js";

export const createExamination = async (req, res) => {
  try {
    // Add the medical staff ID from authenticated user
    const examinationData = {
      ...req.body,
      medicalStaff: req.user.id,
    };

    if (examinationData.exam_date && typeof examinationData.exam_date === "string") {
      examinationData.exam_date = new Date(examinationData.exam_date);
    }

    const validatedData = examinationSchema.parse(examinationData);

    const examination = await addExamination(validatedData);

    return res.status(201).json({
      success: true,
      message: "Үзлэгийн мэдээлэл амжилттай бүртгэгдлээ!",
      data: examination,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

//all the examinations that medical staff
export const getMedicalStaffExamHistory = async (req, res) => {
  try {
    const staffId = req.user.id;
    const filters = req.query; // You can pass query parameters for filtering

    const examinations = await getMedicalStaffExaminations(staffId, filters);

    return res.status(200).json({
      success: true,
      count: examinations.length,
      data: examinations,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getAllExaminationList = async (req, res) => {
  try {
    const filters = req.query;
    const examinations = await getAllExaminations(filters);

    return res.status(200).json({
      success: true,
      count: examinations.length,
      data: examinations,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getExaminationById = async (req, res) => {
  try {
    const { id } = req.params;
    const examination = await getExamination(id);

    return res.status(200).json({
      success: true,
      data: examination,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const updateExaminationById = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      staffId: req.user.id,
    };

    if (updateData.exam_date && typeof updateData.exam_date === "string") {
      updateData.exam_date = new Date(updateData.exam_date);
    }

    const validatedData = examinationUpdateSchema.parse(updateData);

    const updatedExamination = await updateExamination(id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Үзлэгийн мэдээлэл амжилттай шинэчлэгдлээ!",
      data: updatedExamination,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const deleteExaminationById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = {
      id: req.user.id,
      role: req.user.role,
    };

    const result = await removeExamination(id, currentUser);

    return res.status(200).json(result);
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getExaminationDiagnosisList = async (req, res) => {
  try {
    const { examinationId } = req.params;
    const diagnoses = await getExaminationDiagnoses(examinationId);

    // If patient is requesting, verify they own the examination
    if (req.user.role === "Patient") {
      // First check if any diagnoses exist
      if (diagnoses.length > 0) {
        // Check if this patient owns these diagnoses
        if (diagnoses[0].patient._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            error: "Танд энэ үзлэгийн оношийг харах эрх байхгүй байна!",
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: diagnoses.length,
      data: diagnoses,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getPatientExaminationHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const examinations = await getPatientExaminations(patientId);

    return res.status(200).json({
      success: true,
      count: examinations.length,
      data: examinations,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

// Common Error Handler
const handleZodOrAppError = (res, error, fallbackStatus = 400) => {
  if (error.name === "ZodError") {
    const errors = error.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }
  const status = error.statusCode || fallbackStatus;
  const message = error.message || "Something went wrong";
  return res.status(status).json({ error: message });
};
