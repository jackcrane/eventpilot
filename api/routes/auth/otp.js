import jwt from "jsonwebtoken";
import { prisma } from "../../util/prisma.js";

export const post = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  console.log({ email, otp, user });

  delete user.password;

  const otpRecord = await prisma.otp.findFirst({
    where: {
      otp,
      userId: user.id,
    },
  });

  if (!otpRecord) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  if (!otpRecord.active) {
    return res.status(401).json({ message: "OTP has already been used" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ token, user });

  await prisma.otp.update({
    where: {
      id: otpRecord.id,
    },
    data: {
      active: false,
    },
  });

  const requesterIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  await prisma.log.create({
    data: {
      userId: user.id,
      type: "LOGIN",
      data: {
        ip: requesterIp,
      },
    },
  });
};
