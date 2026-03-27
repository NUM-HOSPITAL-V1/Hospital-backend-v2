import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createAdmin,
  createMedicalStaff,
  createPatient,
} from "../../infrastructure/repositories/authRepository.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { createError } from "../../utils/error.js";

export const createUserUseCases = () => {
  const hashPassword = async (password) => {
    if (!password || typeof password !== "string") {
      throw createError("Нууц үг буруу байна!", 400);
    }
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };

  const registerAdmin = async ({
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
  }) => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !password)
      throw createError("Имэйл/нууц үг шаардлагатай!", 400);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) throw createError("Имэйл бүртгэгдсэн байна!", 409);

    const hashedPassword = await hashPassword(password);

    const admin = await createAdmin({
      firstname,
      lastname,
      email: normalizedEmail,
      phoneNumber,
      password_hash: hashedPassword, // ✅
    });
    const payload = { id: admin._id, role: admin.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, admin };
  };

  const login = async ({ email, password }) => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !password)
      throw createError("Имэйл/нууц үг шаардлагатай!", 400);

    const user = await findUserByEmail(normalizedEmail);

    if (!user) throw createError("Hereglegch oldsongui!", 401);
    console.log("keys:", Object.keys(user.toObject?.() ?? user));

    console.log("raw user:", user);
    console.log("toObject:", user.toObject());
    console.log("json:", user.toJSON?.());
    console.log("direct:", user.password_hash);
    console.log("get:", user.get?.("password_hash"));

    const hash = user.get("password_hash");
    if (!hash) throw createError("Хэрэглэгчийн password hash олдсонгүй!", 500);

    const isPasswordValid = await bcrypt.compare(password.trim(), hash);
    if (!isPasswordValid) throw createError("COMPARE FALSE!", 401);


    console.log("JWT_ACCESS_SECRET:", !!process.env.JWT_SECRET);
    console.log("JWT_REFRESH_SECRET:", !!process.env.REFRESH_SECRET); 

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user };
  };

  const registerDoctor = async ({
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
    specialization,
  }) => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !password)
      throw createError("Имэйл/нууц үг шаардлагатай!", 400);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) throw createError("Имэйл бүртгэгдсэн байна!", 409);

    const hashedPassword = await hashPassword(password);

    const staff = await createMedicalStaff({
      firstname,
      lastname,
      email: normalizedEmail,
      phoneNumber,
      password_hash: hashedPassword, // ✅
      specialization,
      position: "Doctor",
    });

    const payload = { id: staff._id, role: staff.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, staff };
  };

  const registerNurse = async ({
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
    specialization,
  }) => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !password)
      throw createError("Имэйл/нууц үг шаардлагатай!", 400);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) throw createError("Имэйл бүртгэгдсэн байна!", 409);

    const hashedPassword = await hashPassword(password);

    const staff = await createMedicalStaff({
      firstname,
      lastname,
      email: normalizedEmail,
      phoneNumber,
      password_hash: hashedPassword, // ✅
      specialization,
      position: "Nurse",
    });

    const payload = { id: staff._id, role: staff.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, staff };
  };

  const registerPatient = async ({
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
    type,
    register,
    address,
    sisiID,
    occupation,
    education,
    school,
    birthOfDate,
    gender,
  }) => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !password)
      throw createError("Имэйл/нууц үг шаардлагатай!", 400);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) throw createError("Имэйл бүртгэгдсэн байна!", 409);

    const hashedPassword = await hashPassword(password);

    const patient = await createPatient({
      firstname,
      lastname,
      email: normalizedEmail,
      phoneNumber,
      password_hash: hashedPassword, // ✅
      type,
      register,
      address,
      sisiID,
      occupation,
      education,
      school,
      birthOfDate,
      gender,
    });

    const payload = { id: patient._id, role: patient.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, patient };
  };

  return {
    registerAdmin,
    registerDoctor,
    registerNurse,
    registerPatient,
    login,
  };
};