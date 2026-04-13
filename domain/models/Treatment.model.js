import { Schema, model } from "mongoose";

const TreatmentSchema = new Schema(
  {
    date: { type: Date },
    treatmentType: {
      type: String,
      enum: ["Uvch", "Dusal Taria", "Sudas Taria",
       "Bulchin Taria", "Arisan dotor taria","Arisan dor taria",
       "Massajnii sandal","Ulaan gerel","Ulitrazvuk","Lazer",
      "Biotens","Limfodrenajnii massaj","Electroforez",
    "Bichil hanuur","Huchilturugch","Mes zasliin boolt"],
    },
    diagnosisType: { type: String, enum: ["in", "out"] },
    totalQuantity: { type: Number },
    frequency: { type: String },
    treatmentDays: { type: Number },
    sessionsCompleted: { type: Number },
    examination_id: { type: Schema.Types.ObjectId, ref: "Examination" },
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
    medicalStaff: { type: Schema.Types.ObjectId, ref: "MedicalStaff" },
  },
  { timestamps: true }
);

const Treatment = model("Treatment", TreatmentSchema);
export default Treatment;
