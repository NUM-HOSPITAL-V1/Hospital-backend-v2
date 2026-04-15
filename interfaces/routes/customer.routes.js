import express from "express";
import {
  deleteCustomerProfileById,
  getCustomerProfileById,
  listCustomerProfiles,
  updateCustomerProfileById,
} from "../controller/customer.controller.js";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeRole(["Admin", "MedicalStaff"]));

router.get("/", listCustomerProfiles);
router.get("/:id", getCustomerProfileById);
router.put("/:id", updateCustomerProfileById);
router.delete("/:id", deleteCustomerProfileById);

export default router;
