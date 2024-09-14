import { prisma } from "../../util/prisma.js";
import jwt from "jsonwebtoken";

export const get = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
