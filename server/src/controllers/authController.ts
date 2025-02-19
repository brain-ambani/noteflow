import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendEmail } from "@/utils/email";

//   signup controller
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // check if user with the same email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // verification code for email verification
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // verification code expires in 10 minutes
    const verificationCodeExpires = new Date(
      new Date().getTime() + 10 * 60 * 1000
    );

    // create a new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpires,
      },
    });

    // send verification email

    const sendVerificationEmail = async (
      userEmail: string,
      verificationCode: string
    ) => {
      const emailBody = `
        <h2>Verify Your Email</h2>
        <p>Use the following code to verify your email:</p>
        <h3>${verificationCode}</h3>
        <p>This code expires in 10 minutes.</p>
      `;

      await sendEmail(userEmail, "Verify Your Email - NoteFlow", emailBody);

      // Respond to client
      res.status(201).json({
        message:
          "User registered successfully. Check your email for verification.",
        userId: newUser.id,
      });
    };
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;

  try {
    if (!email || !verificationCode) {
      return res
        .status(400)
        .json({ error: "Email and verification code are required!" });
    }

    // Find user
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Check if already verified
    if (user.verified) {
      return res.status(400).json({ error: "Email is already verified!" });
    }

    // Check if the verification code matches and is not expired
    if (
      user.verificationCode !== verificationCode ||
      (user.verificationCodeExpires &&
        user.verificationCodeExpires < new Date())
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code!" });
    }

    // Mark user as verified
    await db.user.update({
      where: { email },
      data: {
        verified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
