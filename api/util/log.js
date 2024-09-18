import { prisma } from "./prisma.js";

export const log = async (data) => {
  await prisma.log.create({
    data,
  });
};