import { prisma } from "../../../../util/prisma.js";
import { requireAuth } from "../../../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const todo = await prisma.todoItem.findUnique({
      where: {
        id: req.params.todoId,
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

    if (!todo) {
      return res.status(404).send("Not found");
    }

    return res.json({ data: todo });
  },
];

export const patch = [
  requireAuth,
  async (req, res) => {
    const todo = await prisma.todoItem.findUnique({
      where: {
        id: req.params.todoId,
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

    if (!todo) {
      return res.status(404).send("Not found");
    }

    const updatedTodo = await prisma.todoItem.update({
      where: {
        id: req.params.todoId,
      },
      data: req.body,
    });

    res.json({ data: updatedTodo });

    // If data.stage is updated, log the change to the db as type TODO_STAGE_MODIFIED. If anything else has changed, log the change as type TODO_MODIFIED. There can be multiple changes in a single request, but if only the stage is changed, only one log entry should be created. If the stage is changed and something else is changed, two log entries should be created, and if the stage remains the same but something else is changed, only one log entry should be created.
    if (req.body.stage !== todo.stage) {
      await prisma.log.create({
        data: {
          type: "TODO_STAGE_MODIFIED",
          organizationId: req.params.orgId,
          userId: req.user.id,
          todoItemId: req.params.todoId,
          data: {
            from: todo,
            to: updatedTodo,
          },
        },
      });
    }

    const changes = Object.keys(req.body).filter((key) => key !== "stage");
    if (changes.length) {
      await prisma.log.create({
        data: {
          type: "TODO_MODIFIED",
          organizationId: req.params.orgId,
          userId: req.user.id,
          todoItemId: req.params.todoId,
          data: {
            from: todo,
            to: updatedTodo,
          },
        },
      });
    }
  },
];
