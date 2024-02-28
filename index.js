import "dotenv/config.js";

import express from "express";
import contactsRouter from "./routes/contactsRouter.js";

import "./db.js";

const app = express();

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((error, req, res, next) => {
  const { message = "Internal server error", status = 500 } = error;
  res.status(status).json({ message });
});

export default app;
