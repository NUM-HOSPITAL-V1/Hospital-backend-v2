import express from "express";
import {
  createPrescription,
  getPrescriptionById,
  updatePrescriptionById,
  deletePrescriptionById,
  getPatientPrescriptionList,
  getMyPrescriptions,
 
} from "../controller/prescription.controller.js";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";
import {
  createPrescribedMed,
  getMyPrescribedMeds,
  getPrescribedMedById,
  getPrescriptionMedsList
} from "../controller/prescribeMed.controller.js";
import {
  createPrescribedGuide,
  getMyPrescribedGuides,
  getPrescribedGuideById,
  getPrescriptionGuidesList
} from "../controller/prescribedGuide.controller.js";

const router = express.Router();

//middleware
router.use(authenticateJWT);


//===================== PRESCRIPTIONS =====================
// Create a new prescription (medical staff only)
router.post(
  "/prescription",
  authorizeRole(["MedicalStaff"]),
  createPrescription
);

// Get prescription by ID (medical staff only)
router.get(
  "/prescription/:id",
  authorizeRole(["MedicalStaff", "Admin","Patient"]),
  getPrescriptionById
);

// Update prescription (medical staff only)
router.put(
  "/prescription/:id",
  authorizeRole(["MedicalStaff"]),
  updatePrescriptionById
);

// Delete prescription (medical staff only)
router.delete(
  "/:id",
  authorizeRole(["MedicalStaff"]),
  deletePrescriptionById
);

// Get all prescriptions for a specific patient
router.get(
  "/patient/:patientId/prescriptions",
  authorizeRole(["MedicalStaff", "Admin"]),
  getPatientPrescriptionList
);

// Get all prescriptions created by the logged-in medical staff
router.get(
  "/my-prescriptions",
  authorizeRole(["MedicalStaff","Patient"]),
  getMyPrescriptions
);

router.post(
  "/medication",
  authorizeRole(["MedicalStaff"]),
  createPrescribedMed
);

router.post(
  "/guide",
  authorizeRole(["MedicalStaff"]),
  createPrescribedGuide
);
//===================== PATIENT MEDICATIONS =====================
// Get all medications for the logged-in patient
router.get("/my-medications", authorizeRole(["Patient"]), getMyPrescribedMeds);

// Get a specific medication by ID
router.get("/medication/:id", authorizeRole(["Patient"]), getPrescribedMedById);

// Get all medications for a specific prescription
router.get(
  "/prescription/:prescriptionId/medications",
  authorizeRole(["MedicalStaff", "Admin", "Patient"]),
  getPrescriptionMedsList
);

//===================== PATIENT GUIDES =====================
// Get all guides for the logged-in patient
router.get("/my-guides", authorizeRole(["Patient"]), getMyPrescribedGuides);

// Get a specific guide by ID
router.get("/guide/:id", authorizeRole(["Patient"]), getPrescribedGuideById);

// Get all guides for a specific prescription
router.get(
  "/prescription/:prescriptionId/guides",
  authorizeRole(["MedicalStaff", "Admin", "Patient"]),
  getPrescriptionGuidesList
);


export default router;
