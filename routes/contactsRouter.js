const express = require("express");
const controllers = require("../controllers/contactsControllers.js");
const validateBody = require("../helpers/validateBody");
const schemas = require("../schemas/contactsSchemas.js");
const contactsRouter = express.Router();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", controllers.getOneContact);

contactsRouter.delete("/:id", controllers.deleteContact);

contactsRouter.post(
  "/",
  validateBody(schemas.createContactSchema),
  controllers.createContact
);

contactsRouter.put(
  "/:id",
  validateBody(schemas.updateContactSchema),
  controllers.updateContact
);

module.exports = contactsRouter;
