import {
  adminSignupSchema,
  medicalStaffSignupSchema,
  patientSignupSchema,
} from "../../utils/validators.js";
import { toPublicMedStaff, toPublicPatient, toPublicUser } from "../../utils/formatter.js";
import { createUserUseCases } from "../../application/use_cases/authUseCases.js";
const { registerPatient, registerAdmin, registerDoctor, registerNurse, login } =
  createUserUseCases();

const sendTokenResponse = (res, refreshToken, payload, message = "") => {
  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({ message, ...payload });
};

export const signUp = async (req, res) => {
  try {
    const input = patientSignupSchema.parse(req.body);
    const { accessToken, refreshToken, patient } = await registerPatient(input);
    const publicPatient = toPublicUser(patient);
    return sendTokenResponse(
      res,
      refreshToken,
      { user: publicPatient, accessToken },
      "Хэрэглэгч бүртгэгдлээ!"
    );
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await login(req.body);
    // role oos n hamaarch different medeelel yvuulah bol iimerhu oruulj bolno toPublicAdmin ntr gedg ch yumu
    const publicUser =
      user?.role === "Admin"
        ? toPublicUser(user)
        : user?.role === "Patient"
        ? toPublicPatient(user)
        : toPublicMedStaff(user);

    return sendTokenResponse(
      res,
      refreshToken,
      { user: publicUser, accessToken },
      "Амжилттай нэвтэрлээ!"
    );
  } catch (error) {
    return handleZodOrAppError(res, error, 401);
  }
};

export const signUpAdmin = async (req, res) => {
  try {
    const input = adminSignupSchema.parse(req.body);
    const { accessToken, refreshToken, admin } = await registerAdmin(input);
    const publicAdmin = toPublicUser(admin);
    return sendTokenResponse(
      res,
      refreshToken,
      { admin: publicAdmin, accessToken },
      "Админ бүртгэгдлээ!"
    );
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const signUpDoctor = async (req, res) => {
  try {
    const input = medicalStaffSignupSchema.parse(req.body);
    const { accessToken, refreshToken, staff } = await registerDoctor(input);
    const publicDoctor = toPublicUser(staff);
    return sendTokenResponse(
      res,
      refreshToken,
      { staff: publicDoctor, accessToken },
      "Эмч бүртгэгдлээ!"
    );
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const signUpNurse = async (req, res) => {
  try {
    const input = medicalStaffSignupSchema.parse(req.body);
    const { accessToken, refreshToken, staff } = await registerNurse(input);
    const publicNurse = toPublicUser(staff);
    return sendTokenResponse(
      res,
      refreshToken,
      { staff: publicNurse, accessToken },
      "Сувилагч бүртгэгдлээ!"
    );
  } catch (error) {
    return handleZodOrAppError(res, error);
  }
};

export const validateAccessToken = async (req, res) => {
  return res.status(204).end();
};

// Common Error Handler
const handleZodOrAppError = (res, error, fallbackStatus = 400) => {
  if (error.name === "ZodError") {
    const errors = error.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }
  const status = error.statusCode || fallbackStatus;
  const message = error.message || "Something went wrong";
  return res.status(status).json({ error: message });
};
