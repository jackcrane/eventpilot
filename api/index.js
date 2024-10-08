import express from "express";
import createRouter, { router } from "express-file-routing";
import cors from "cors";
import jwt from "jsonwebtoken";
import { prisma } from "./util/prisma.js";
import "dotenv/config";
import { createRouteHandler, createUploadthing } from "uploadthing/express";
const f = createUploadthing();
const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((d) => {
    console.log("Upload complete", d);
  }),
};

const app = express();

app.use(cors());

app.use(express.json());

app.use(async (req, res, next) => {
  // await new Promise((resolve) => setTimeout(resolve, 300));
  next();
});

app.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    req.user = user;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
});

app.use((req, res, next) => {
  console.log(req.method, req.url, req.user?.id);
  next();
});

app.use(
  "/fs/upload",
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
      callbackUrl: process.env.BACKEND_TUNNEL,
    },
  })
);

await createRouter(app); // as wrapper function

app.listen(2000);
