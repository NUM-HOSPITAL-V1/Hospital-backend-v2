import { Schema, model } from 'mongoose';

const MedicineSchema = new Schema(
  {
    name: { type: String },
    type: { type: String, enum: ["medication", "Supplies", "Creams", "Emergency Items"] },
    dosage: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    expiryDate: { type: Date },
    category: { type: String },
    subCategory: { type: String },
    form: { type: String },
    manufacturer: { type: String },
    supplier: { type: String },
    batchNumber: { type: String },
    location: { type: String },
    unit: { type: String },
    reorderLevel: { type: Number },
    status: { type: String },
    description: { type: String },
    medicalStaff: { type: Schema.Types.ObjectId, ref: "MedicalStaff" },
  },
  { timestamps: true }
);

const Medicine = model('Medicine', MedicineSchema);
export default Medicine;
