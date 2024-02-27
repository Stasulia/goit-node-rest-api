import express from "express";
import controllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

const jsonParser = express.json();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", controllers.getOneContact);

contactsRouter.delete("/:id", controllers.deleteContact);

contactsRouter.post(
  "/",
  jsonParser,
  validateBody(createContactSchema),
  controllers.createContact
);

contactsRouter.put(
  "/:id",
  jsonParser,
  validateBody(updateContactSchema),
  controllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  jsonParser,
  validateBody(updateFavoriteSchema),
  controllers.updateFavorite
);

export default contactsRouter;
