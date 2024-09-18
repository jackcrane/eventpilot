import { log } from "../../util/log.js";
import { prisma } from "../../util/prisma.js";
import { requireAuth } from "../../util/requireAuth.js";

export const include = {
  marketingPrimaryBannerImage: {
    select: {
      key: true,
      name: true,
      url: true,
    },
  },
  marketingLogo: {
    select: {
      key: true,
      name: true,
      url: true,
    },
  },
  marketingSquareLogo: {
    select: {
      key: true,
      name: true,
      url: true,
    },
  },
};

export const get = [
  requireAuth,
  async (req, res) => {
    const userId = req.user.id;

    const org = await prisma.organization.findUnique({
      where: {
        id: req.params.orgId,
        users: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include,
    });

    res.json(org);
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
        include,
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

      if (data.mainBannerImage) {
        data.marketingPrimaryBannerImage = {
          create: {
            key: data.mainBannerImage.key,
            name: data.mainBannerImage.name,
            url: data.mainBannerImage.url,
          },
        };
        delete data.mainBannerImage;
      }
      if (data.logoImage) {
        data.marketingLogo = {
          create: {
            key: data.logoImage.key,
            name: data.logoImage.name,
            url: data.logoImage.url,
          },
        };
        delete data.logoImage;
      }
      if (data.squareLogoImage) {
        data.marketingSquareLogo = {
          create: {
            key: data.squareLogoImage.key,
            name: data.squareLogoImage.name,
            url: data.squareLogoImage.url,
          },
        };
        delete data.squareLogoImage;
      }

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
        include,
        data,
      });

      res.json(updatedOrg);

      if (
        JSON.stringify(org) === JSON.stringify(updatedOrg)
      ) return;

      log({
        type: "ORG_MODIFIED",
        userId: req.user.id,
        organizationId: req.params.orgId,
        data: {
          diff: {
            from: org,
            to: updatedOrg,
          },
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
