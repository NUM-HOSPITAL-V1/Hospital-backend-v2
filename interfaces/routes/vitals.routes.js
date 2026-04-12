import express from "express";

import {
  createVitalSigns,
  getVitalSignsById,
  updateVitalSignsById,
  deleteVitalSignsById,
  getPatientVitalSignsList,
  getPatientLatestVitalSigns,
  getPatientVitalSignsByDateRange,
  getMyVitalSignsByStaff,
  getMyVitalSigns,
  getMyLatestVitalSigns,
  createVitalSignsFromIoT
} from "../controller/vitals.controller.js";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";
import VitalSigns from "../../domain/models/Vital.model.js";
import { DateTime } from 'luxon';

const router = express.Router();
router.use(authenticateJWT);

router.post("/vitalsigns", authorizeRole(["MedicalStaff"]), createVitalSigns);

router.get(
  '/vitalsigns/latest',
  authorizeRole(['Patient', 'MedicalStaff', 'Admin']),
  async (req, res) => {
    try {
      const latestVital = await VitalSigns.findOne({ medicalStaff: req.user.id })
        .sort({ createdAt: -1 })
        .limit(1);

      if (!latestVital) return res.status(404).json({ message: 'No vital signs found' });

      res.status(200).json({
        systolic: latestVital.right_systolic || latestVital.left_systolic,
        diastolic: latestVital.right_diastolic || latestVital.left_diastolic,
        mean_arterial_pressure: latestVital.right_mean_arterial_pressure || latestVital.left_mean_arterial_pressure,
        heart_rate: latestVital.right_heart_rate || latestVital.left_heart_rate
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch latest vital signs', error: err.message });
    }
  }
);

router.get(
  "/patient/:patientId/vitalsigns",
  authorizeRole(["MedicalStaff", "Admin"]),
  getPatientVitalSignsList
);

router.get(
  "/patient/:patientId/vitalsigns/latest",
  authorizeRole(["MedicalStaff", "Admin"]),
  getPatientLatestVitalSigns
);

router.get(
  "/patient/:patientId/vitalsigns/daterange",
  authorizeRole(["MedicalStaff", "Admin"]),
  getPatientVitalSignsByDateRange
);

router.get(
  "/vitalsigns/my/recorded-by-staff",
  authorizeRole(["MedicalStaff"]),
  getMyVitalSignsByStaff
);

router.get(
  "/vitalsigns/my/daterange",
  authorizeRole(["Patient"]),
  (req, res, next) => {
    req.params.patientId = req.user.id;
    next();
  },
  getPatientVitalSignsByDateRange
);

router.get(
  "/vitalsigns/my/latest",
  authorizeRole(["Patient"]),
  getMyLatestVitalSigns
);

router.get(
  "/vitalsigns/my/recorded",
  authorizeRole(["Patient"]),
  getMyVitalSigns
);

router.get(
  "/vitalsigns/:id",
  authorizeRole(["MedicalStaff", "Patient"]),
  getVitalSignsById
);

router.put(
  "/vitalsigns/:id",
  authorizeRole(["MedicalStaff"]),
  updateVitalSignsById
);

router.delete(
  "/vitalsigns/:id",
  authorizeRole(["MedicalStaff"]),
  deleteVitalSignsById
);

router.post(
  "/vitalsigns/receive",
  authorizeRole(["MedicalStaff", "Admin"]),
  async (req, res) => {
    try {
      const { diastolic, meanArterialPressure, pulseRate, systolic } = req.body;

      if (!diastolic || !systolic || !pulseRate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate a unique vital_signs_id if not provided
      const vital_signs_id = Date.now() + Math.floor(Math.random() * 1000);

      // Create a new vital signs record with only the blood pressure data
      const newVitalSign = new VitalSigns({
        vital_signs_id: vital_signs_id,
        right_diastolic: diastolic,
        right_mean_arterial_pressure: meanArterialPressure,
        right_heart_rate: pulseRate,
        right_systolic: systolic,
        medicalStaff: req.user.id,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now()
      });

      await newVitalSign.save();

      res.status(201).json({ 
        message: "Vital signs received successfully",
        data: {
          systolic: systolic,
          diastolic: diastolic,
          mean_arterial_pressure: meanArterialPressure,
          heart_rate: pulseRate
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save vital signs data", error: err.message });
    }
  }
);

export default router;
