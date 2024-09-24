import { log } from "../../../util/log.js";
import { prisma } from "../../../util/prisma.js";
import { requireAuth } from "../../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    // const org = await prisma.organization.findUnique({
    //   where: {
    //     id: req.params.orgId,
    //     users: {
    //       some: {
    //         userId: req.user.id,
    //       },
    //     },
    //   },
    // });

    const logs = await prisma.log.findMany({
      where: {
        organizationId: req.params.orgId,
        organization: {
          users: {
            some: {
              userId: req.user.id,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    res.json(logs);
  },
];
