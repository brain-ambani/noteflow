import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendEmail } from "@/utils/email";

// sendVerificationEmail function
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

  console.log(`📧 Verification email sent to ${userEmail}`);
};

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
    // log the verification code
    console.log(`🟢 Verification Code for ${email}: ${verificationCode}`);

    // send verification email
    await sendVerificationEmail(email, verificationCode);

    // Respond to client
    res.status(201).json({
      message:
        "User registered successfully. Check your email for verification.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// verifyEmail controller
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

// user login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // check if user with the same email already exists
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Respond to client
    res.status(200).json({
      message: "User logged in successfully",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
