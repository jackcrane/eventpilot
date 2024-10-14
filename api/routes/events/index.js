import { prisma } from "../../util/prisma.js";
import { requireAuth } from "../../util/requireAuth.js";
import { validateEmail } from "../../util/validateEmail.js";
// import { include } from "./[orgId]/index.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;

    const orgs = await prisma.event.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      take: 50,
    });

    res.json(orgs);
  },
];
