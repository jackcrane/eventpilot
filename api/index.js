import express from "express";
import createRouter, { router } from "express-file-routing";
import cors from "cors";
import jwt from "jsonwebtoken";
import { prisma } from "./util/prisma.js";
import { stripe } from "./util/stripe.js";
import "dotenv/config";
import { createRouteHandler, createUploadthing } from "uploadthing/express";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }), // Capture raw body
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WHSEC
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      console.log(err);
    }

    // Handle the event
    switch (event.type) {
      case "setup_intent.succeeded":
        const setupIntent = event.data.object;
        console.log(setupIntent);
        console.log("SetupIntent was successful!");
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        console.log(event);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
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

const applyColors = (str) => {
  switch (str) {
    case "orgs":
    case "events":
    case "todos":
    case "auth":
    case "logs":
      return chalk.white(str);
    default:
      return chalk.hex("#ff6600")(str);
  }
};

app.use((req, res, next) => {
  console.log(
    chalk.bgCyan(" " + req.method + " "),
    chalk.hex("#ff6600")(req.url),
    req.user?.id
  );
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

// Serve static files from the built React app
app.use(express.static(path.join(__dirname, "../app/dist")));

await createRouter(app); // as wrapper function

// Catch-all route for handling any routes not matched on the server, serving index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../app/dist", "index.html"));
});

app.listen(2000, () => {
  console.log("Server running on port 2000");
});
