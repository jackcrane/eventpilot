import bcrypt from "bcrypt";
import "dotenv/config";
import { prisma } from "../../util/prisma.js";
import { generateOTP } from "../../util/otp.js";

export const post = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  console.log({ email, password, user });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const otp = await generateOTP(user.id, user.email);
  console.log(otp);

  res.status(200).json({ message: "OTP sent to your email" });
};
