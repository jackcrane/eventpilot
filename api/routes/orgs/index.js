import { prisma } from "../../util/prisma.js";
import { requireAuth } from "../../util/requireAuth.js";
import { spawnNewTodos } from "../../util/spawnNewOrgTodos.js";
import { validateEmail } from "../../util/validateEmail.js";
import { include } from "./[orgId]/index.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;

    const orgs = await prisma.organization.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include,
      take: 50,
    });

    res.json(orgs);
  },
];

export const post = [
  requireAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        name,
        website,
        publicContactEmail,
        privateContactEmail,
        privateContactPhone,
        category,
      } = req.body;

      if (!name || name.length < 1) {
        return res.status(400).json({ message: "Name is required." });
      }
      if (!website || website.length < 1) {
        return res.status(400).json({ message: "Website is required." });
      }
      if (!publicContactEmail || !validateEmail(publicContactEmail)) {
        return res
          .status(400)
          .json({ message: "A valid Public Contact Email is required." });
      }
      if (!privateContactEmail || !validateEmail(privateContactEmail)) {
        return res
          .status(400)
          .json({ message: "A valid Private Contact Email is required." });
      }
      if (!privateContactPhone || privateContactPhone.length < 9) {
        return res
          .status(400)
          .json({ message: "Private Contact Phone is required." });
      }
      if (!category.id || category.id < 1) {
        return res.status(400).json({ message: "Category is required." });
      }

      const org = await prisma.organization.create({
        data: {
          name,
          website,
          publicContactEmail,
          privateContactEmail,
          privateContactPhone,
          category: category.id,
          users: {
            create: {
              userId,
            },
          },
        },
      });

      res.json(org);

      await prisma.log.create({
        data: {
          type: "ORG_CREATED",
          userId,
          organizationId: org.id,
        },
      });

      // Generate the todos
      await spawnNewTodos(org.id);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Something went wrong." });
    }
  },
];
