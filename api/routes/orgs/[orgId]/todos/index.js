import { prisma } from "../../../../util/prisma.js";
import { requireAuth } from "../../../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const limit = req.query.limit || 1000;
    const offset = req.query.offset || 0;
    const todos = await prisma.todoItem.findMany({
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
        dueDate: "asc",
      },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const count = await prisma.todoItem.count({
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
      data: todos,
      meta: {
        count,
      },
    });
  },
];
