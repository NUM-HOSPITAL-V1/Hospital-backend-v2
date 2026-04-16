import { createError } from "../../utils/error.js";
import {
  listAllMedicalStaff,
  findMedicalStaffById,
  createMedicalStaff,
  updateMedicalStaffById,
  deleteMedicalStaffById
} from "../../infrastructure/repositories/medicalStaffRepository.js";
import bcrypt from "bcryptjs";

export const createMedicalStaffUseCases = () => {
  const listStaff = async (filters = {}) => {
    return await listAllMedicalStaff(filters);
  };

  const getStaff = async (id) => {
    const staff = await findMedicalStaffById(id);
    if (!staff) throw createError("Ажилтан олдсонгүй!", 404);
    return staff;
  };

  const addStaff = async (data) => {
    const normalizedEmail = typeof data.email === "string" ? data.email.trim().toLowerCase() : data.email;
    const passwordHash = await bcrypt.hash(data.password, 10);
    const { password, ...rest } = data;
    return await createMedicalStaff({ ...rest, email: normalizedEmail, password_hash: passwordHash });
  };

  const updateStaff = async (id, updateData) => {
    const staff = await findMedicalStaffById(id);
    if (!staff) throw createError("Ажилтан олдсонгүй!", 404);
  
    // Хэрвээ шинэ нууц үг ирсэн бол bcrypt ашиглан hash хийх
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
  
    return await updateMedicalStaffById(id, updateData);
  };
  

  const removeStaff = async (id) => {
    const staff = await findMedicalStaffById(id);
    if (!staff) throw createError("Ажилтан олдсонгүй!", 404);
    await deleteMedicalStaffById(id);
    return { success: true, message: "Ажилтан амжилттай устгагдлаа!" };
  };

  return {
    listStaff,
    getStaff,
    addStaff,
    updateStaff,
    removeStaff
  };
};
