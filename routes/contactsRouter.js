import express from "express";
import controllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import auth from "../middleware/auth.js";

const contactsRouter = express.Router();

const jsonParser = express.json();

contactsRouter.get("/", auth, controllers.getAllContacts);

contactsRouter.get("/:id", auth, controllers.getOneContact);

contactsRouter.delete("/:id", auth, controllers.deleteContact);

contactsRouter.post(
  "/",
  auth,
  jsonParser,
  validateBody(createContactSchema),
  controllers.createContact
);

contactsRouter.put(
  "/:id",
  auth,
  jsonParser,
  validateBody(updateContactSchema),
  controllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  auth,
  jsonParser,
  validateBody(updateFavoriteSchema),
  controllers.updateFavorite
);

export default contactsRouter;
