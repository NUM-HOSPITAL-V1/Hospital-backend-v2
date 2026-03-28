import express from "express";
import {
  createTreatment,
  getTreatmentById,
  updateTreatmentById,
  deleteTreatmentById,
  getAllTreatmentsList,
  getPatientTreatmentsList,
  getMyTreatments,
  getTreatmentsByExaminationId,
  getTreatmentsByTreatmentType,
  getTreatmentsByDate
} from "../controller/treatment.controller.js";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Create a new treatment (medical staff only)
router.post(
  "/",
  authorizeRole(["MedicalStaff"]),
  createTreatment
);

// Get all treatments
router.get(
  "/list/all",
  authorizeRole(["MedicalStaff", "Admin"]),
  getAllTreatmentsList
);

// Get all treatments for a specific patient
router.get(
  "/patient/:patientId",
  authorizeRole(["MedicalStaff", "Admin", "Patient"]),
  getPatientTreatmentsList
);

// Get all treatments created by the logged-in medical staff or for the logged-in patient
router.get(
  "/list/my",
  authorizeRole(["MedicalStaff", "Patient"]),
  getMyTreatments
);

// Get all treatments for a specific examination
router.get(
  "/examination/:examinationId",
  authorizeRole(["MedicalStaff", "Admin"]),
  getTreatmentsByExaminationId
);

// Get all treatments by treatment type
router.get(
  "/type/:treatmentType",
  authorizeRole(["MedicalStaff", "Admin"]),
  getTreatmentsByTreatmentType
);

// Get all treatments within a date range
router.get(
  "/date-range",
  authorizeRole(["MedicalStaff", "Admin"]),
  getTreatmentsByDate
);

// Get treatment by ID
router.get(
  "/:id",
  authorizeRole(["MedicalStaff", "Admin", "Patient"]),
  getTreatmentById
);

// Update treatment (medical staff only)
router.put(
  "/:id",
  authorizeRole(["MedicalStaff"]),
  updateTreatmentById
);

// Delete treatment (medical staff only)
router.delete(
  "/:id",
  authorizeRole(["MedicalStaff"]),
  deleteTreatmentById
);

export default router;
