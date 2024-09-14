import bcrypt from "bcrypt";
import "dotenv/config";
import { prisma } from "../../util/prisma.js";
import { Resend } from "resend";
import { generateOTP } from "../../util/otp.js";
const resend = new Resend(process.env.RESEND_API_KEY);

export const post = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const prevuser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (prevuser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,255}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 8-255 characters long, include at least one capital letter, one number, and one special character.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const otp = await generateOTP(user.id, user.email);
  console.log(otp);

  res.status(200).json({ message: "User created successfully" });

  await prisma.log.createMany({
    data: [
      {
        userId: user.id,
        type: "USER_CREATED",
        data: {
          user_id: user.id,
        },
      },
    ],
  });
};

export const get = async (req, res) => {
  res.status(200).json({ message: "Signup route" });
};
