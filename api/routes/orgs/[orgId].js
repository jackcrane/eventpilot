import { prisma } from "../../util/prisma.js";
import { requireAuth } from "../../util/requireAuth.js";

export const get = [
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;

    const orgs = await prisma.organization.findUnique({
      where: {
        id: req.params.orgId,
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    res.json(orgs);
  },
];

export const put = [
  requireAuth,
  async (req, res) => {
    try {
      const org = await prisma.organization.findUnique({
        where: {
          id: req.params.orgId,
          users: {
            some: {
              userId: req.user.id,
            },
          },
        },
      });

      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const data = {
        ...req.body,
        name: req.body.name,
        website: req.body.website,
        publicContactEmail: req.body.publicContactEmail,
        privateContactEmail: req.body.privateContactEmail,
        privateContactPhone: req.body.privateContactPhone,
        category: req.body.category?.id,
      };

      // Remove anything that is undefined or null
      Object.keys(data).forEach((key) => {
        if (data[key] === undefined || data[key] === null) {
          delete data[key];
        }
      });

      const updatedOrg = await prisma.organization.update({
        where: {
          id: req.params.orgId,
        },
        data,
      });

      res.json(updatedOrg);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
