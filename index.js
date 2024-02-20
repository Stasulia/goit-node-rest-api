const express = require("express");
const cors = require("cors");
const contactsRouter = require("./routes/contactsRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((error, req, res, next) => {
  const { message = "Server error", status = 500 } = error;
  res.status(status).json({ message });
});

module.exports = app;
