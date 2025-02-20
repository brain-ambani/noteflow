import express from "express";
import { getProfile } from "@/controllers/userController";
import { verifyToken } from "@/middlewares/authMiddleware";

const userRouter = express.Router();

userRouter.get("/profile", verifyToken, getProfile);

export default userRouter;
