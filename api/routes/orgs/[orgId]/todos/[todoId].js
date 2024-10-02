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
        logs: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            todoItem: true,
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
    if (req.body.stage && req.body.stage !== todo.stage) {
      console.log(req.body.stage, todo.stage);
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
    } else {
      const changes = Object.keys(req.body).filter((key) => {
        if (key !== "stage") {
          if (key === "dueDate") {
            return req.body[key].toString() !== todo[key].toISOString();
          }
          return req.body[key] !== todo[key];
        }
      });
      if (changes.length && changes.length > 0) {
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
    }
  },
];

export const put = [
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

    // Add the comment to the todo item
    const comment = await prisma.todoItemComment.create({
      data: {
        todoItemId: req.params.todoId,
        userId: req.user.id,
        text: req.body.text,
      },
    });

    await prisma.log.create({
      data: {
        type: "TODO_COMMENT_CREATED",
        organizationId: req.params.orgId,
        userId: req.user.id,
        todoItemId: req.params.todoId,
        todoItemCommentId: comment.id,
      },
    });

    const updatedTodo = await prisma.todoItem.findUnique({
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
        logs: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            todoItem: true,
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
        },
      },
    });

    res.json({ data: updatedTodo });
  },
];
