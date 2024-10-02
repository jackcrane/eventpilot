import { log } from "../../../util/log.js";
import { prisma } from "../../../util/prisma.js";
import { requireAuth } from "../../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const limit = req.query.limit || 1000;
    const offset = req.query.offset || 0;

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
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        todoItem: {
          include: {
            comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
        todoItemComment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const count = await prisma.log.count({
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
    });

    res.json({
      data: logs,
      meta: {
        count,
      },
    });
  },
];
