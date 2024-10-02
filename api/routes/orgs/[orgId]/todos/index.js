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
        deleted: false,
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

export const post = [
  requireAuth,
  async (req, res) => {
    const todo = await prisma.todoItem.create({
      data: {
        organizationId: req.params.orgId,
        userId: req.user.id,
        stage: "OPEN",
        ...req.body,
      },
    });

    await prisma.log.create({
      data: {
        type: "TODO_CREATED",
        organizationId: req.params.orgId,
        userId: req.user.id,
        todoItemId: todo.id,
      },
    });

    res.json(todo);
  },
];
