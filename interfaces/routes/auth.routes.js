import {
  signUp,
  signIn,
  signUpDoctor,
  signUpNurse,
  signUpAdmin,
  validateAccessToken,
} from "../controller/auth.controller.js";
import express from "express";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup/patient", signUp);
router.post("/signin", signIn);
router.post("/signup/doctor", signUpDoctor);
router.post("/signup/nurse", signUpNurse);
router.post("/signup/admin", signUpAdmin);
router.get("/validate", authenticateJWT, validateAccessToken);

export default router;
