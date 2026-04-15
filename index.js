import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { performance } from 'perf_hooks';
import bodyParser from "body-parser";
import AuthRouter from "./interfaces/routes/auth.routes.js";
import PatientRouter from "./interfaces/routes/patient.routes.js";
import CustomerRouter from "./interfaces/routes/customer.routes.js";
import HealthRouter from "./interfaces/routes/health.routes.js";
import MedicalStaffRouter from "./interfaces/routes/medicalstaff.routes.js";
import ExaminationRouter from "./interfaces/routes/examination.routes.js";
import QuestionnaireRouter from "./interfaces/routes/questionnaire.routes.js";
import QuestionRouter from "./interfaces/routes/question.routes.js";
import DiseaseRouter from "./interfaces/routes/diseases.routes.js";
import DiagnosisRouter from "./interfaces/routes/diagnosis.routes.js";
import DiagnosisLookupRouter from "./interfaces/routes/diagnosisLookup.routes.js";
import PrescriptionRouter from "./interfaces/routes/prescription.routes.js";
import MedicineRouter from "./interfaces/routes/medicine.routes.js";
import StockRouter from "./interfaces/routes/stock.routes.js";
import TreatmentRouter from "./interfaces/routes/treatment.routes.js";
import VitalRouter from "./interfaces/routes/vitals.routes.js";
import AllergyRouter from "./interfaces/routes/allergy.routes.js";
import CHDisRouter from "./interfaces/routes/chronicDisease.routes.js";
import MedicineUsageRouter from "./interfaces/routes/medicineUsage.routes.js";


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const end = performance.now();
    const duration = (end - start).toFixed(2);
    console.log(`${req.method} ${req.originalUrl} - ${duration} ms`);
  });

  next();
});

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI! Check your .env file.");
  process.exit(1);
}
//
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/status", (req, res) =>
  res.send("OK"));

app.use("/api/auth", AuthRouter);
app.use("/api/customer", CustomerRouter);
app.use("/api/allergy", AllergyRouter);
app.use("/api/patient", PatientRouter);
app.use("/api", HealthRouter);
app.use("/api/medicalstaff", MedicalStaffRouter);
app.use("/api/examination", ExaminationRouter);
app.use("/api/questionnaire", QuestionnaireRouter);
app.use("/api/question", QuestionRouter);
app.use("/api/diseases", DiseaseRouter);
app.use("/api/diagnosis", DiagnosisRouter);
app.use("/api/diagnosis-lookup", DiagnosisLookupRouter);
app.use("/api/prescription", PrescriptionRouter);
app.use("/api/medicine", MedicineRouter);
app.use("/api/stock", StockRouter);
app.use("/api/treatment", TreatmentRouter);
app.use("/api/vital", VitalRouter);
app.use("/api/chronicdisease", CHDisRouter);
app.use("/api/medicine-usage", MedicineUsageRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
