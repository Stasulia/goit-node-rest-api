import "dotenv/config.js";
import express from "express";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/auth.js";

import "./db.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((error, req, res, next) => {
  const { message = "Internal server error", status = 500 } = error;
  res.status(status).json({ message });
});

export default app;

// import express from "express";

// import routes from "./routes/index.js";

// import "./db.js";

// const app = express();

// app.use("/api", routes);

// app.use((req, res, next) => {
//   res.status(404).send("Route not found");
// });

// app.use((error, req, res, next) => {
//   const { message = "Internal server error", status = 500 } = error;
//   res.status(status).json({ message });
// });

// app.listen(8080, () => {
//   console.log("Server is running on port 8080");
// });
