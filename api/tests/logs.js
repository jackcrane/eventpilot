import { log } from "../util/log.js";
import { prisma } from "../util/prisma.js";

// await prisma.log.create({
//   data: {
//     type: "ORG_CREATED",
//     data: {},
//   },
// });

await log({
  type: "ORG_CREATED",
  data: {
    diff: {
      from: {},
      to: {},
    },
  },
});
