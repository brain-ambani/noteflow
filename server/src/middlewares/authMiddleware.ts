import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token from headers
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // Attach user info to request
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(401).json({ error: "Invalid token!" });
    return;
  }
};
