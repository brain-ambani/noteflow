import { signup, verifyEmail } from "@/controllers/authController";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/verify-email", verifyEmail);

export default authRouter;
