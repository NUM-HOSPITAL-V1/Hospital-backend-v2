import { createPatientUseCases } from "../../application/use_cases/patientUseCases.js";
import { createExaminationUseCases } from "../../application/use_cases/examinationUseCases.js";
import { toPublicPatient } from "../../utils/formatter.js";
import { createError } from "../../utils/error.js";
import { patientUpdateSchema } from "../../utils/validators.js";
import Patient from "../../domain/models/Patient.model.js";

const { 
  listPatients, 
  getPatient, 
  removePatient ,
} = createPatientUseCases();

const { getPatientExaminations } = createExaminationUseCases();

//buh uwchtung jagsaah

export const listAllPatients = async (req, res) => {
  try {
    const filters = req.query || {};
    const patients = await listPatients(filters);
    const safePatients = patients.map(toPublicPatient);
    
    res.status(200).json({
      message: "Read successfully!",
      count: safePatients.length,
      patients: safePatients,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};


// Get a specific patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await getPatient(id);
    const safePatient = toPublicPatient(patient);
    
    res.status(200).json({
      message: "Success",
      patient: safePatient,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};

// Update a patient by ID
export const updatePatientById = async (req, res) => {
  try {
    const validated = patientUpdateSchema.parse(req.body);
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, validated, {
      new: true
    });

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated", patient: updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete a patient by ID
export const deletePatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await removePatient(id);
    
    res.status(200).json({
      message: result.message || "Үйлчлүүлэгч амжилттай устгагдлаа",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};
//uuriin uzlegiin medeellig harah
export const getOwnExaminations = async (req, res) => {
  try {
    const patientId = req.user.id; // токеноос гарч ирсэн өөрийн ID

    const examinations = await getPatientExaminations(patientId);

    return res.status(200).json({
      success: true,
      count: examinations.length,
      data: examinations,
    });
  } catch (error) {
    console.error("Error fetching own examinations:", error);
    return res
      .status(500)
      .json({ error: "Үзлэгийн түүх авахад алдаа гарлаа!" });
  }
};

export const getOwnProfile = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    return res.status(200).json({
      success: true,
      patient: toPublicPatient(patient),
    });
  } catch (error) {
    console.error("Error fetching own profile:", error);
    return res.status(500).json({ error: "Профайл авахад алдаа гарлаа!" });
  }
};

// Patient-specific controllers for managing their own allergies



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
