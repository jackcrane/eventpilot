import { prisma } from "../../../../util/prisma.js";
import { requireAuth } from "../../../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;

    const org = await prisma.organization.findUnique({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
        id: req.params.orgId,
      },
      include: {
        billingConfig: true,
      },
    });

    if (!org) {
      return res.status(404).json({
        error: "Organization not found",
      });
    }

    if (!org.billingConfig) {
      return res.status(404).json({
        id: org.id,
        isInGoodPaymentStanding: false,
      });
    }

    res.json({
      id: org.id,
      isInGoodPaymentStanding: org.billingConfig.isInGoodPaymentStanding,
    });
  },
];
