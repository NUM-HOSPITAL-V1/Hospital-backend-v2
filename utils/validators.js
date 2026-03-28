import { z } from "zod";

export const adminSignupSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters" }),
  lastname: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters" }),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const medicalStaffSignupSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters" }),
  lastname: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters" }),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const patientSignupSchema = z.object({
  firstname: z.string().min(1, { message: "Нэр шаардлагатай" }),
  lastname: z.string().min(1, { message: "Овог шаардлагатай" }),
  email: z.string().email("Цахим шуудангийн формат буруу"),
  password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой"),
  type: z.enum(["Student", "Staff", "Teacher"]),
  phoneNumber: z.string().min(1, "Утасны дугаар шаардлагатай"),
  register: z.string().min(10, "Регистрийн дугаар буруу"),
  sisiID: z.string().optional(),
  school: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  birthOfDate: z.string().optional(), // эсвэл z.date().optional() гэж хийж болно
  gender: z.enum(["male", "female"]).optional()
});
export const patientUpdateSchema = z.object({
  firstname: z.string().min(1, "Нэр шаардлагатай").optional(),
  lastname: z.string().min(1, "Овог шаардлагатай").optional(),
  email: z.string().email("Цахим шуудангийн формат буруу").optional(),
  type: z.enum(["Student", "Staff", "Teacher", "Patient"]).optional(),
  phoneNumber: z.string().min(1, "Утасны дугаар шаардлагатай").optional(),
  register: z.string().min(10, "Регистрийн дугаар буруу").optional(),
  sisiID: z.string().optional(),
  school: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  birthOfDate: z.string().optional(),
  gender: z.enum(["male", "female"]).optional()
});

//exam

export const examinationSchema = z.object({
  medicalStaff: z.string(),
  patient: z.string(),
  exam_date: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg)
      : undefined;
  }, z.date()).optional(),
  doctors_examination: z.enum([
    "Initial",
    "Follow-up",
    "Preventive",
    "Active Monitoring",
    "Home Visit",
    "House Call",
  ]),
  exam_type: z.string().optional(),
  illness: z.string().optional(),
  surgery: z.string().optional(),
  callback: z.boolean().optional(),
  reason: z.string().optional(),
  sendToHigherLevel: z.boolean().optional(),
  isVioleted: z.boolean().optional(),
  sickDays: z.number().int().min(0).optional(),
  status: z.enum(["Ongoing", "Done", "Todo"]).optional(),
});

export const examinationUpdateSchema = z.object({
  staffId: z.string(), // Used for checking permission, will be removed before updating
  exam_date: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg)
      : undefined;
  }, z.date()).optional(),
  doctors_examination: z
    .enum([
      "Initial",
      "Follow-up",
      "Preventive",
      "Active Monitoring",
      "Home Visit",
      "House Call",
    ])
    .optional(),
  exam_type: z.string().optional(),
  illness: z.string().optional(),
  surgery: z.string().optional(),
  callback: z.boolean().optional(),
  reason: z.string().optional(),
  sendToHigherLevel: z.boolean().optional(),
  isVioleted: z.boolean().optional(),
  sickDays: z.number().int().min(0).optional(),
  status: z.enum(["Ongoing", "Done", "Todo"]).optional(),
});

//allergy
export const allergySchema = z.object({
  allergy_name: z.string().min(1, "Харшлын нэр оруулна уу"),
  severity: z.enum(["mild", "moderate", "severe"]),
  reaction: z.string().optional(),
  date_of_onset: z
    .preprocess((arg) => {
      return typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : undefined;
    }, z.date())
    .optional(),
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"),
});

export const allergyUpdateSchema = z.object({
  allergy_name: z.string().min(1, "Харшлын нэр оруулна уу").optional(),
  severity: z.enum(["mild", "moderate", "severe"]).optional(),
  reaction: z.string().optional(),
  date_of_onset: z
    .preprocess((arg) => {
      return typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : undefined;
    }, z.date())
    .optional(),
});

export const chronicDiseaseSchema = z.object({
  name: z.string().min(1, "Өвчний нэр оруулна уу"),
  description: z.string().optional(),
  diagnosisDate: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg)
      : undefined;
  }, z.date()),
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"),
});

export const chronicDiseaseUpdateSchema = z.object({
  name: z.string().min(1, "Өвчний нэр оруулна уу").optional(),
  description: z.string().optional(),
  diagnosisDate: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg)
      : undefined;
  }, z.date()),
});

//QUESTION

export const questionnaireSchema = z.object({
  patient_id: z.string().min(1, "Өвчтөний ID оруулна уу"),
  medicalStaff_id: z.string().min(1, "Ажилтны ID оруулна уу"),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Асуултыг оруулна уу"),
  answer: z.string().min(1, "Хариултыг оруулна уу"),
  questionnaire_id: z.string().min(1, "Асуумжийн ID оруулна уу"),
});

export const patientQuestionnaireResponseSchema = z.object({
  answer: z.array(z.string()).min(1, "Хариултыг оруулна уу"),
});

export const vitalSignsSchema = z.object({
  vital_signs_id: z.number().min(1).optional(), // Optional, but if provided must be >= 1
  date: z.date().optional(), // Optional date
  concsiousness_status: z.string().optional(), // Optional string for consciousness status
  
  // Right side fields
  right_diastolic: z.number().optional(),
  right_mean_arterial_pressure: z.number().optional(),
  right_heart_rate: z.number().optional(),
  right_systolic: z.number().optional(),
  right_note: z.string().optional(),
  
  // Left side fields
  left_diastolic: z.number().optional(),
  left_mean_arterial_pressure: z.number().optional(),
  left_heart_rate: z.number().optional(),
  left_systolic: z.number().optional(),
  left_note: z.string().optional(),
  
  // General vital signs
  temperature: z.number().optional(),
  respiration_rate: z.number().optional(),
  saturation: z.number().optional(), // Matching the "saturation" field from Mongoose model
  height: z.number().optional(),
  weight: z.number().optional(),
  
  // Relationships (referencing other models)
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"), // Must be a valid patient ID
  medicalStaff: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"), // Must be a valid medical staff ID
});

export const vitalSignsUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  
  // General vital signs fields
  date: z.date().optional(),  // Optional date field (for updates)
  concsiousness_status: z.string().optional(), // Optional field for consciousness status
  
  // Right side fields
  right_diastolic: z.number().optional(),
  right_mean_arterial_pressure: z.number().optional(),
  right_heart_rate: z.number().optional(),
  right_systolic: z.number().optional(),
  right_note: z.string().optional(),
  
  // Left side fields
  left_diastolic: z.number().optional(),
  left_mean_arterial_pressure: z.number().optional(),
  left_heart_rate: z.number().optional(),
  left_systolic: z.number().optional(),
  left_note: z.string().optional(),
  
  // Additional general fields
  temperature: z.number().optional(),
  respiration_rate: z.number().optional(),
  oxygen_saturation: z.number().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
});

export const dateRangeSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Огноо YYYY-MM-DD форматтай байх ёстой."),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Огноо YYYY-MM-DD форматтай байх ёстой."),
});

export const diagnosisSchema = z.object({
  diagnosisCode: z.string().min(1, "Өвчний кодыг оруулна уу"),
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"),
  examination: z.string().optional(),
  medicalStaff: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"),
});

export const diagnosisUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  diagnosisCode: z.string().optional(),
  examination: z.string().optional(),
});

export const prescriptionSchema = z.object({
  date: z.date().optional(),
  prescribedBy: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"),
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"),
});

export const prescriptionUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  date: z.date().optional(),
});

export const prescribedMedSchema = z.object({
  name: z.string().min(1, "Эмийн нэр оруулна уу"),
  description: z.string().optional(),
  dose: z.string().min(1, "Эмийн тун оруулна уу"),
  frequency: z.string().min(1, "Хэрэглэх давтамж оруулна уу"),
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"),
  medicalStaff: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"),
  prescription: z.string().min(1, "Жорын ID оруулна уу"),
});

export const prescribedMedUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  name: z.string().min(1, "Эмийн нэр оруулна уу").optional(),
  description: z.string().optional(),
  dose: z.string().min(1, "Эмийн тун оруулна уу").optional(),
  frequency: z.string().min(1, "Хэрэглэх давтамж оруулна уу").optional(),
});

export const prescribedGuideSchema = z.object({
  name: z.string().min(1, "Зөвлөмжийн нэр оруулна уу"),
  description: z.string().min(1, "Зөвлөмжийн тайлбар оруулна уу"),
  dose: z.string().optional(),
  frequency: z.string().optional(),
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"),
  medicalStaff: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"),
  prescription: z.string().min(1, "Жорын ID оруулна уу"),
});

export const prescribedGuideUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  name: z.string().min(1, "Зөвлөмжийн нэр оруулна уу").optional(),
  description: z.string().min(1, "Зөвлөмжийн тайлбар оруулна уу").optional(),
  dose: z.string().optional(),
  frequency: z.string().optional(),
});


export const medicineSchema = z.object({
  name: z.string().min(1, "Эмийн нэр оруулна уу"),
  type: z.enum(["medication", "Supplies", "Creams", "Emergency Items"], {
    required_error: "Төрөл заавал шаардлагатай",
  }),
  dosage: z.string().optional(),
  price: z.number().min(0, "Үнэ 0-ээс их байх ёстой"),
  quantity: z.number().int().min(1, "Тоо хэмжээ 1-ээс их байх ёстой"),
  expiryDate: z
    .preprocess((arg) => {
      return typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
        : undefined;
    }, z.date()),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  form: z.string().optional(),
  manufacturer: z.string().optional(),
  supplier: z.string().optional(),
  batchNumber: z.string().optional(),
  location: z.string().optional(),
  unit: z.string().optional(),
  reorderLevel: z.number().int().min(0).optional(),
  status: z.string().optional(),
  description: z.string().optional(),
  medicalStaff: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"),
  // med_id is auto-generated, so don't include it in validation
});

export const medicineUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  name: z.string().min(1, "Эмийн нэр оруулна уу").optional(),
  type: z.enum(["medication", "Supplies", "Creams", "Emergency Items"]).optional(),
  dosage: z.string().optional(),
  price: z.number().min(0, "Үнэ 0-ээс их байх ёстой").optional(),
  quantity: z.number().int().min(1, "Тоо хэмжээ 1-ээс их байх ёстой").optional(),
  expiryDate: z
    .preprocess((arg) => {
      return typeof arg === "string" || arg instanceof Date
        ? new Date(arg)
      : undefined;
    }, z.date())
    .optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  form: z.string().optional(),
  manufacturer: z.string().optional(),
  supplier: z.string().optional(),
  batchNumber: z.string().optional(),
  location: z.string().optional(),
  unit: z.string().optional(),
  reorderLevel: z.number().int().min(0).optional(),
  status: z.string().optional(),
  description: z.string().optional(),
  // med_id should not be updatable
});

// Stock Validators
export const stockSchema = z.object({
  quantity: z.string().min(1, "Тоо хэмжээ оруулна уу"),
  medicine: z.string().optional(),
  treatment: z.string().optional(),
  medicalStaff: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"),
});

export const stockUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  quantity: z.string().min(1, "Тоо хэмжээ оруулна уу").optional(),
  medicine: z.string().optional(),
  treatment: z.string().optional(),
});

// Treatment Validators
export const treatmentSchema = z.object({
  date: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg)
      : undefined;
  }, z.date()).optional(),
  treatmentType: z.enum([
    "Uvch",
    "Dusal Taria",
    "Sudas Taria",
    "Bulchin Taria",
    "Arisan dotor taria",
    "Arisan dor taria",
    "Massajnii sandal",
    "Ulaan gerel",
    "Ulitrazvuk",
    "Lazer",
    "Biotens",
    "Limfodrenajnii massaj",
    "Electroforez",
    "Bichil hanuur",
    "Huchilturugch",
    "Mes zasliin boolt",
  ]),
  diagnosisType: z.enum(["in", "out"]),
  totalQuantity: z.number().int().min(1, "Нийт эмчилгээний тоо 1-ээс их байх ёстой"),
  sessionsCompleted: z.number().int().min(0, "Хийгдсэн эмчилгээний тоо 0-ээс их байх ёстой").optional(),
  examination_id: z.string().optional(),
  patient: z.string().min(1, "Өвчтөний ID оруулна уу"),
  medicalStaff: z.string().min(1, "Эмч/Сувилагчийн ID оруулна уу"),
});

export const treatmentUpdateSchema = z.object({
  staffId: z.string().optional(), // Used for verification, not for storing
  date: z.preprocess((arg) => {
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg)
      : undefined;
  }, z.date()).optional(),
  treatmentType: z.enum([
    "Uvch",
    "Dusal Taria",
    "Sudas Taria",
    "Bulchin Taria",
    "Arisan dotor taria",
    "Arisan dor taria",
    "Massajnii sandal",
    "Ulaan gerel",
    "Ulitrazvuk",
    "Lazer",
    "Biotens",
    "Limfodrenajnii massaj",
    "Electroforez",
    "Bichil hanuur",
    "Huchilturugch",
    "Mes zasliin boolt",
  ]).optional(),
  diagnosisType: z.enum(["in", "out"]).optional(),
  totalQuantity: z.number().int().min(1, "Нийт эмчилгээний тоо 1-ээс их байх ёстой").optional(),
  sessionsCompleted: z.number().int().min(0, "Хийгдсэн эмчилгээний тоо 0-ээс их байх ёстой").optional(),
  examination_id: z.string().optional(),
});
