import {
    createTreatmentUseCases,
  } from "../../application/use_cases/TreatmentUseCases.js";
  import {
    treatmentSchema,
    treatmentUpdateSchema,
    dateRangeSchema,
  } from "../../utils/validators.js";
  
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
  
  // TREATMENT
  const {
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
  } = createTreatmentUseCases();
  
  // Treatment Controllers
  export const createTreatment = async (req, res) => {
    try {
      // Add the medical staff ID from authenticated user
      const treatmentData = {
        ...req.body,
        medicalStaff: req.user.id,
      };
  
      // Parse date if it's a string
      if (treatmentData.date && typeof treatmentData.date === "string") {
        treatmentData.date = new Date(treatmentData.date);
      }
  
      // Validate input
      const validatedData = treatmentSchema.parse(treatmentData);
  
      const treatment = await addTreatment(validatedData);
  
      return res.status(201).json({
        success: true,
        message: "Эмчилгээний мэдээлэл амжилттай бүртгэгдлээ!",
        data: treatment,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const getTreatmentById = async (req, res) => {
    try {
      const { id } = req.params;
      const treatment = await getTreatment(id);
  
      // Check if patient is requesting their own treatment
      if (
        req.user.role === "Patient" &&
        treatment.patient._id.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          error: "Танд бусад өвчтөний эмчилгээний мэдээлэл харах эрх байхгүй байна!",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: treatment,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const updateTreatmentById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updateData = {
        ...req.body,
        staffId: req.user.id,
        requesterRole: req.user.role,
      };
  
      // Parse date if it's a string
      if (updateData.date && typeof updateData.date === "string") {
        updateData.date = new Date(updateData.date);
      }
  
      // Validate update data
      const validatedData = treatmentUpdateSchema.parse(updateData);
  
      const updatedTreatment = await updateTreatment(id, validatedData);
  
      return res.status(200).json({
        success: true,
        message: "Эмчилгээний мэдээлэл амжилттай шинэчлэгдлээ!",
        data: updatedTreatment,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const deleteTreatmentById = async (req, res) => {
    try {
      const { id } = req.params;
      const staffId = req.user.id;
  
      const result = await removeTreatment(id, staffId);
  
      return res.status(200).json(result);
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const getAllTreatmentsList = async (req, res) => {
    try {
      const treatments = await getAllTreatments();
  
      return res.status(200).json({
        success: true,
        count: treatments.length,
        data: treatments,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const getPatientTreatmentsList = async (req, res) => {
    try {
      const { patientId } = req.params;
  
      // Check if patient is requesting their own treatments
      if (req.user.role === "Patient" && patientId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "Танд бусад өвчтөний эмчилгээний мэдээлэл харах эрх байхгүй байна!",
        });
      }
  
      const treatments = await getPatientTreatments(patientId);
  
      return res.status(200).json({
        success: true,
        count: treatments.length,
        data: treatments,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const getMyTreatments = async (req, res) => {
    try {
      const userId = req.user.id;
  
      if (req.user.role === "Patient") {
        // If user is a patient, get their treatments
        const treatments = await getPatientTreatments(userId);
        return res.status(200).json({
          success: true,
          count: treatments.length,
          data: treatments,
        });
      } else if (req.user.role === "MedicalStaff") {
        // If user is medical staff, get treatments they created
        const treatments = await getMedicalStaffTreatments(userId);
        return res.status(200).json({
          success: true,
          count: treatments.length,
          data: treatments,
        });
      } else {
        return res.status(403).json({
          success: false,
          error: "Энэ үйлдлийг гүйцэтгэх эрх байхгүй байна!",
        });
      }
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const getTreatmentsByExaminationId = async (req, res) => {
    try {
      const { examinationId } = req.params;
      const treatments = await getTreatmentsByExamination(examinationId);
  
      return res.status(200).json({
        success: true,
        count: treatments.length,
        data: treatments,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const getTreatmentsByTreatmentType = async (req, res) => {
    try {
      const { treatmentType } = req.params;
      const treatments = await getTreatmentsByType(treatmentType);
  
      return res.status(200).json({
        success: true,
        count: treatments.length,
        data: treatments,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };
  
  export const getTreatmentsByDate = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: "Эхлэх болон дуусах огноо оруулна уу",
        });
      }
  
      // Validate date range
      dateRangeSchema.parse({ startDate, endDate });
  
      const treatments = await getTreatmentsByDateRange(startDate, endDate);
  
      return res.status(200).json({
        success: true,
        count: treatments.length,
        data: treatments,
      });
    } catch (error) {
      return handleZodOrAppError(res, error);
    }
  };