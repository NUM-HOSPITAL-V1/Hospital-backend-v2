import {
  deletePatientById,
  getOwnExaminations,
  getOwnProfile,
  getPatientById,
  listAllPatients,
  updatePatientById,
} from "../controller/patient.controller.js";
import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";


const router = express.Router();
router.use(authenticateJWT);

router.get(
  "/view",
  authenticateJWT,
  authorizeRole(["Admin", "MedicalStaff"]),
  listAllPatients
);

router.get(
  "/examinations",
  authenticateJWT,
  authorizeRole(["Patient"]),
  getOwnExaminations
);

router.get(
  "/profile",
  authenticateJWT,
  authorizeRole(["Patient"]),
  getOwnProfile
);

router.get(
  "/:id",
  authenticateJWT,
  authorizeRole(["Admin", "MedicalStaff"]),
  getPatientById
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRole(["Admin", "MedicalStaff"]),
  updatePatientById
);

router.delete(
  "/:id",
  authenticateJWT,
  authorizeRole(["Admin", "MedicalStaff"]),
  deletePatientById
);






export default router;
