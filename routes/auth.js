import express from "express";
import validateBody from "../helpers/validateBody.js";
import authController from "../controllers/authControllers.js";
import { loginSchema, registerSchema } from "../models/user.js";
//import schemas from "../models/user.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  authController.register
);

authRouter.post(
  "/login",
  jsonParser,
   validateBody(loginSchema),
  authController.login
);

export default authRouter;
