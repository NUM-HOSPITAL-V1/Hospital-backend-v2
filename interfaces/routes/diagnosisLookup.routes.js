import express from "express";

import {
  getDiagnosisByCodeLookup,
  getDiagnosisLookupStatus,
  searchDiagnosisLookup,
} from "../controller/diagnosisLookup.controller.js";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);

router.get(
  "/search",
  authorizeRole(["MedicalStaff", "Admin"]),
  searchDiagnosisLookup
);

router.get(
  "/code/:code",
  authorizeRole(["MedicalStaff", "Admin"]),
  getDiagnosisByCodeLookup
);

router.get(
  "/health",
  authorizeRole(["MedicalStaff", "Admin"]),
  getDiagnosisLookupStatus
);

export default router;
