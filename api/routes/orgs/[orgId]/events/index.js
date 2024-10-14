import { prisma } from "../../../../util/prisma.js";
import { requireAuth } from "../../../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;
    const orgId = req.params.orgId;

    const events = await prisma.event.findMany({
      where: {
        organizationId: orgId,
        users: {
          some: {
            userId: userId,
            OR: [
              {
                role: "ADMIN",
              },
              {
                role: "OWNER",
              },
              {
                role: "USER",
              },
              {
                role: "VIEWER",
              },
            ],
          },
        },
      },
    });

    res.json({ meta: events.length, data: events });
  },
];

export const post = [
  requireAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const orgId = req.params.orgId;
      const event = await prisma.event.create({
        data: {
          organizationId: orgId,
          users: {
            create: {
              userId: userId,
              role: "OWNER",
            },
          },
        },
      });

      // TODO: Spawn new todo items for the event

      console.log(event);

      res.json(event);

      await prisma.log.create({
        data: {
          type: "EVENT_CREATED",
          eventId: event.id,
          organizationId: orgId,
          userId: userId,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create event" });
    }
  },
];
