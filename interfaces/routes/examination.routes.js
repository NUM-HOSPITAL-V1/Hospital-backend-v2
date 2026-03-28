import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

import {
  createExamination,
  getAllExaminationList,
  getMedicalStaffExamHistory,
  updateExaminationById,
  getExaminationById,
  deleteExaminationById,
  getPatientExaminationHistory,
  getExaminationDiagnosisList,
} from "../controller/examination.controller.js";

const router = express.Router();
router.use(authenticateJWT);

router.post(
  "/", 
  authorizeRole(["MedicalStaff"]), 
  createExamination
);

router.get(
  "/list/all",
  authorizeRole(["MedicalStaff", "Admin"]),
  getAllExaminationList
);

// Get all examinations for a specific patient
router.get(
  "/patient/:patientId",
  authorizeRole(["MedicalStaff", "Admin"]),
  getPatientExaminationHistory
);

//doctor gets their exams
router.get(
  "/doctor/my-examinations",
  authorizeRole(["MedicalStaff"]),
  getMedicalStaffExamHistory
);

// Get all diagnoses for a specific examination (for medical staff and the patient)
router.get(
  "/diagnosis/:examinationId",
  authorizeRole(["MedicalStaff", "Admin"]),
  getExaminationDiagnosisList
);

// Get all diagnoses for a specific examination (patient can only view their own examinations)
router.get(
  "/:examinationId/diagnoses",
  authenticateJWT,
  authorizeRole(["Patient"]),
  getExaminationDiagnosisList
);

router.get(
  "/:id",
  authorizeRole(["MedicalStaff", "Admin"]),
  getExaminationById
);

router.put(
  "/:id", 
  authorizeRole(["MedicalStaff"]), 
  updateExaminationById
);

router.delete(
  "/:id",
  authorizeRole(["MedicalStaff"]),
  deleteExaminationById
);

export default router;
