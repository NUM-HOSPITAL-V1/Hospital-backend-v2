import { createVitalSignsUseCases } from "../../application/use_cases/vitalSignsUseCases.js";
import VitalSigns from "../../domain/models/Vital.model.js";
import {
  vitalSignsSchema,
  vitalSignsUpdateSchema,
  dateRangeSchema,
} from "../../utils/validators.js";


//VITAL SIGNS
const {
  addVitalSigns,
  getVitalSigns,
  updateVitalSigns,
  removeVitalSigns,
  getPatientVitalSignsHistory,
  getLatestVitalSigns,
  getVitalSignsByDateRange,
  getMedicalStaffVitalSigns,
} = createVitalSignsUseCases();

export const createVitalSigns = async (req, res) => {
  try {
    const { patientId, patient, vital_signs, ...flatVitalSigns } = req.body;
    const resolvedPatientId = patientId || patient;

    const vitalSignsData = {
      ...(vital_signs || flatVitalSigns),
      patient: resolvedPatientId,
      medicalStaff: req.user.id,
    };

    if (!resolvedPatientId) {
      return res.status(400).json({ error: 'Patient ID is missing' });
    }

    // Parse date if it's a string
    if (vitalSignsData.date && typeof vitalSignsData.date === "string") {
      vitalSignsData.date = new Date(vitalSignsData.date);
    }

    // Validate input
    const validatedData = vitalSignsSchema.parse(vitalSignsData);

    const vitalSigns = await addVitalSigns(validatedData);

    return res.status(201).json({
      success: true,
      message: "Амин үзүүлэлтийн мэдээлэл амжилттай бүртгэгдлээ!",
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getVitalSignsById = async (req, res) => {
  try {
    const { id } = req.params;
    const vitalSigns = await getVitalSigns(id);

    return res.status(200).json({
      success: true,
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const updateVitalSignsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Add staff ID for verification that they recorded these vital signs
    const updateData = {
      ...req.body,
      staffId: req.user.id,
    };

    // Parse date if it's a string
    if (updateData.date && typeof updateData.date === "string") {
      updateData.date = new Date(updateData.date);
    }

    // Validate update data
    const validatedData = vitalSignsUpdateSchema.parse(updateData);

    const updatedVitalSigns = await updateVitalSigns(id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Амин үзүүлэлтийн мэдээлэл амжилттай шинэчлэгдлээ!",
      data: updatedVitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const deleteVitalSignsById = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user.id;

    const result = await removeVitalSigns(id, staffId);

    return res.status(200).json(result);
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getPatientVitalSignsList = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit } = req.query;

    const vitalSigns = await getPatientVitalSignsHistory(
      patientId,
      parseInt(limit) || 0
    );

    return res.status(200).json({
      success: true,
      count: vitalSigns.length,
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getPatientLatestVitalSigns = async (req, res) => {
  try {
    const { patientId } = req.params;
    const vitalSigns = await getLatestVitalSigns(patientId);

    return res.status(200).json({
      success: true,
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getPatientVitalSignsByDateRange = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate date range
    const validatedDates = dateRangeSchema.parse({ startDate, endDate });

    const vitalSigns = await getVitalSignsByDateRange(
      patientId,
      validatedDates.startDate,
      validatedDates.endDate
    );

    return res.status(200).json({
      success: true,
      count: vitalSigns.length,
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getMyVitalSigns = async (req, res) => {
  try {
    const patientId = req.user.id;
    const vitalSigns = await getPatientVitalSignsHistory(patientId);

    return res.status(200).json({
      success: true,
      count: vitalSigns.length,
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getMyLatestVitalSigns = async (req, res) => {
  try {
    const patientId = req.user.id;
    const vitalSigns = await getLatestVitalSigns(patientId);

    return res.status(200).json({
      success: true,
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const getMyVitalSignsByStaff = async (req, res) => {
  try {
    const staffId = req.user.id;
    const { limit } = req.query;

    const vitalSigns = await getMedicalStaffVitalSigns(
      staffId,
      parseInt(limit) || 0
    );

    return res.status(200).json({
      success: true,
      count: vitalSigns.length,
      data: vitalSigns,
    });
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};
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

// This function handles creating vital signs from the /vitalsigns/receive endpoint
export const createVitalSignsFromIoT = async (data, req, res) => {
  try {
    const vitalSignsData = {
      ...data,
      medicalStaff: req.user.id
    };
    const vitalSigns = await addVitalSigns(vitalSignsData);

    return vitalSigns;
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
}
  
