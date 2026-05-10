import { createMedicalStaffUseCases } from "../../application/use_cases/medicalStaffUsecases.js";
import { toPublicMedStaff } from "../../utils/formatter.js";

const MedicalStaffUseCases = createMedicalStaffUseCases();

const handleError = (res, error) => {
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  return res.status(status).json({ error: message });
};

class MedicalStaffController {
  async list(req, res) {
    try {
      const data = await MedicalStaffUseCases.listStaff();
      res.json(data.map(toPublicMedStaff));
    } catch (error) {
      handleError(res, error);
    }
  }

  async get(req, res) {
    try {
      const staff = await MedicalStaffUseCases.getStaff(req.params.id);
      res.json(toPublicMedStaff(staff));
    } catch (error) {
      handleError(res, error);
    }
  }

  async create(req, res) {
    try {
      const newStaff = await MedicalStaffUseCases.addStaff(req.body);
      res.status(201).json(toPublicMedStaff(newStaff));
    } catch (error) {
      handleError(res, error);
    }
  }

  async update(req, res) {
    try {
      const updated = await MedicalStaffUseCases.updateStaff(req.params.id, req.body);
      res.json(toPublicMedStaff(updated));
    } catch (error) {
      handleError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const result = await MedicalStaffUseCases.removeStaff(req.params.id);
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new MedicalStaffController();
