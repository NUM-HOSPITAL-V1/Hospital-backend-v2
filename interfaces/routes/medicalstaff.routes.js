import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";
import MedicalStaffController from "../controller/medicalstaff.controller.js";

const router = express.Router();
router.use(authenticateJWT);
router.use(authorizeRole(["Admin"]));

router.get("/", MedicalStaffController.list);
router.get("/:id", MedicalStaffController.get);
router.post("/", MedicalStaffController.create);
router.put("/:id", MedicalStaffController.update);
router.delete("/:id", MedicalStaffController.delete);

export default router;
