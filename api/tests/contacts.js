import { readFileSync } from "fs";
import { prisma } from "../util/prisma.js";

let contacts = JSON.parse(readFileSync("contacts.json", "utf-8"));

async function main() {
  contacts = contacts.map((contact) => ({
    organizationId: "cm1grpktl00067ul6bp3rl3me",
    ...contact,
    createdAt: new Date(contact.createdAt),
  }));

  await prisma.organizationMarketingContact.createMany({
    data: contacts,
  });
}

main();
