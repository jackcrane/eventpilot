import { prisma } from "./prisma.js";
import { encrypt } from "./insecureEncrypt.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const should_send_email = process.env.SHOULD_SEND_EMAIL === "true";

export const generateOTP = async (userId) => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  await prisma.otp.create({
    data: {
      otp,
      userId,
    },
  });

  const encryptedEmail = encodeURIComponent(encrypt(user.email));
  const encryptedDate = encodeURIComponent(encrypt(new Date().toISOString()));
  const encryptedOtp = encodeURIComponent(encrypt(otp.toString()));

  const url =
    process.env.BASE_URL +
    "/auth/otp" +
    `?e=${encryptedEmail}&x=${encryptedDate}&o=${encryptedOtp}`;

  if (!should_send_email) {
    await prisma.log.create({
      data: {
        type: "OTP_SENT",
        data: {
          resend_id: "123",
        },
        userId: user.id,
      },
    });
    return {
      otp,
      url,
    };
  }

  const { data, error } = await resend.emails.send({
    from: "Paddlefest <eventpilot@email.geteventpilot.com>",
    to: user.email,
    subject: "Your OTP for Paddlefest",
    text: `Your OTP for Paddlefest is ${otp}. You can also use this link to log in ${url}`,
  });

  if (error) {
    console.error("Error sending email", error);
  }

  await prisma.log.create({
    data: {
      type: "OTP_SENT",
      userId: user.id,
      data: {
        resend_id: data.id,
      },
    },
  });

  return {
    otp,
    url,
  };
};
