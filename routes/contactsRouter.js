import express from "express";

const contacts = require(../models/contacts.js) //імпортуемо з файлу, що робили на першому дз
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

//contactsRouter.get("/", getAllContacts);

contactsRouter.get("/", async (req, res, next) => {
  const result = await contacts.getAllContacts();
  res.json(result)
});

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContact);

export default contactsRouter;
