import { prisma } from "../../../../util/prisma.js";
import { requireAuth } from "../../../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const offset = req.query.offset || 0;
    const contacts = await prisma.organizationMarketingContact.findMany({
      where: {
        organizationId: req.params.orgId,
      },
      skip: parseInt(offset),
      orderBy: {
        createdAt: "asc",
      },
    });

    const count = await prisma.organizationMarketingContact.count({
      where: {
        organizationId: req.params.orgId,
      },
    });

    return res.json({
      data: contacts,
      meta: {
        count,
      },
    });
  },
];
