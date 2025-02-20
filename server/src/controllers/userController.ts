import { Request, Response } from "express";
import { db } from "@/db/db";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({ user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
