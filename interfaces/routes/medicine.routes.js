import express from "express";
import {
  createMedicine,
  getMedicineById,
  updateMedicineById,
  deleteMedicineById,
  getAllMedicinesList,
  getMyMedicines,
  searchMedicinesByName,
  getExpiringMedicines,
  getLowStockMedicinesList
} from "../controller/medicine.controller.js";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Create a new medicine (medical staff only)
router.post(
  "/",
  authorizeRole(["MedicalStaff", "Admin"]),
  createMedicine
);

// Get all medicines
router.get(
  "/list/all",
  authorizeRole(["MedicalStaff", "Admin"]),
  getAllMedicinesList
);

// Get all medicines created by the logged-in medical staff
router.get(
  "/list/my",
  authorizeRole(["MedicalStaff"]),
  getMyMedicines
);

// Search medicines by name
router.get(
  "/search",
  authorizeRole(["MedicalStaff", "Admin"]),
  searchMedicinesByName
);

// Get medicines that will expire between two dates
router.get(
  "/expiring",
  authorizeRole(["MedicalStaff", "Admin"]),
  getExpiringMedicines
);

// Get medicines with low stock
router.get(
  "/low-stock",
  authorizeRole(["MedicalStaff", "Admin"]),
  getLowStockMedicinesList
);

// Get medicine by ID
router.get(
  "/:id",
  authorizeRole(["MedicalStaff", "Admin"]),
  getMedicineById
);

// Update medicine (medical staff only)
router.put(
  "/:id",
  authorizeRole(["MedicalStaff", "Admin"]),
  updateMedicineById
);

// Delete medicine (medical staff only)
router.delete(
  "/:id",
  authorizeRole(["MedicalStaff", "Admin"]),
  deleteMedicineById
);

export default router;
