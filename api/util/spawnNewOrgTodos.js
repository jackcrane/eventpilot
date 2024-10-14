import { prisma } from "./prisma.js";

const POTENTIAL_TODOS = [
  {
    key: "legalName",
    title: "Set up a legal name",
    description:
      "When required by law, this is the primary name that will be used to identify your organization. It is important to configure it so we can help you handle imporant matters.",
    slug: "org.legalName.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "taxId",
    title: "Set up a tax ID",
    description:
      "Setting an EIN (Employer Identification Number) or other relevant tax ID for the organization allows us to report your personal information to our payouts partner.",
    slug: "org.taxId.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "type",
    title: "Set up an organization type",
    description:
      "This is the type of organization you are registering. This should match the legal status of your organization.",
    slug: "org.type.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "addressLine1",
    title: "Set up an address (line 1)",
    description:
      "This is the address where your organization is registered. This address should match the address on your legal documents and forms.",
    slug: "org.address.line1.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "city",
    title: "Set up an address (city)",
    description:
      "This is the address where your organization is registered. This address should match the address on your legal documents and forms.",
    slug: "org.address.city.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "state",
    title: "Set up an address (state)",
    description:
      "This is the address where your organization is registered. This address should match the address on your legal documents and forms.",
    slug: "org.address.state.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "zip",
    title: "Set up an address (zip)",
    description:
      "This is the address where your organization is registered. This address should match the address on your legal documents and forms.",
    slug: "org.address.zip.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "addressPublic",
    title: "Decide if your address should be public",
    description: "Decide if your address should be published.",
    slug: "org.address.public.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "legalContactEmail",
    title: "Set up a legal contact email",
    description:
      "This is the email address where we can reach your organization's for legal purposes. This email address may be used to send legal notices, updates to our terms of service, and other important legal information.",
    slug: "org.legalContactEmail.unset",
    href: "/dashboard/organizations/:orgId/legal",
  },
  {
    key: "marketingPrimaryBannerImageId",
    title: "Upload a primary banner image",
    description:
      "Upload a primary image. This is the primary image that will be displayed on your organization's profile page. It should be a high-quality image that represents your organization well.",
    slug: "org.marketingPrimaryBannerImageId.unset",
    href: "/dashboard/organizations/:orgId/marketing",
  },
  {
    key: "marketingLogoId",
    title: "Upload a logo",
    description:
      "Upload a logo. This is the logo that will be displayed on your organization's profile page. It should be a high-quality image that represents your organization well.",
    slug: "org.marketingLogoId.unset",
    href: "/dashboard/organizations/:orgId/marketing",
  },
  {
    key: "marketingSquareLogoId",
    title: "Upload a square logo",
    description:
      "Upload a square logo. This is the square logo that will be displayed on your organization's profile page. It should be a high-quality image that represents your organization well.",
    slug: "org.marketingSquareLogoId.unset",
    href: "/dashboard/organizations/:orgId/marketing",
  },
];

export const spawnNewTodos = async (orgId) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      todoItems: true,
    },
  });

  const spawnIfNull = (key, title, description, slug, href) => {
    if (!key || key === "") {
      console.log("Key is null");
      const existingTodo = org.todoItems.find((todo) => todo.slug === slug);
      if (existingTodo) {
        console.log("Todo already exists");
        return null;
      }

      return {
        title,
        text: description,
        slug,
        href: href.replace(":orgId", orgId),
        type: "ORG_FINISH_CONFIGURATION",
        organizationId: orgId,
      };
    }
  };

  const todoList = [];

  POTENTIAL_TODOS.forEach((todo) => {
    const { key, title, description, slug, href } = todo;
    const todoItem = spawnIfNull(org[key], title, description, slug, href);
    if (todoItem) {
      todoList.push(todoItem);
    }
  });

  if (todoList.length) {
    for (const todo of todoList) {
      // Create each todo item individually
      const createdTodo = await prisma.todoItem.create({
        data: todo,
      });

      // Create a corresponding log for each created todo item
      await prisma.log.create({
        data: {
          type: "TODO_CREATED",
          todoItemId: createdTodo.id,
          organizationId: orgId,
        },
      });
    }
  }
};

export const completeAutoTodo = async (orgId, slug) => {
  const todo = await prisma.todoItem.findFirst({
    where: {
      organizationId: orgId,
      slug,
    },
  });

  if (!todo) {
    return;
  }

  if (
    todo.stage === "WAITING" ||
    todo.stage === "BLOCKED" ||
    todo.stage === "WONT_DO" ||
    todo.stage === "COMPLETE"
  ) {
    await prisma.log.create({
      data: {
        type: "TODO_AUTO_UPDATE_FAILED",
        todoItemId: todo.id,
        organizationId: orgId,
      },
    });

    await prisma.todoItemComment.create({
      data: {
        todoItemId: todo.id,
        text: "This todo was not automatically completed because it is in a stage that is not eligible for automatic completion. We only automatically complete todos that are autogenerated and are in the 'open' or 'in progress' stages.",
      },
    });

    return false;
  }

  await prisma.todoItem.update({
    where: { id: todo.id },
    data: {
      stage: "COMPLETE",
    },
  });

  await prisma.log.create({
    data: {
      type: "TODO_STAGE_MODIFIED",
      todoItemId: todo.id,
      organizationId: orgId,
      data: {
        from: todo,
        to: {
          ...todo,
          stage: "COMPLETE",
        },
      },
    },
  });

  await prisma.log.create({
    data: {
      type: "TODO_AUTO_UPDATE",
      todoItemId: todo.id,
      organizationId: orgId,
    },
  });

  await prisma.todoItemComment.create({
    data: {
      todoItemId: todo.id,
      text: "This todo was automatically completed by the system when you finished the required steps. We only automatically complete todos that are autogenerated and are in the 'open' or 'in progress' stages.",
    },
  });

  return true;
};
