import express from "express";
import validateBody from "../helpers/validateBody.js";
import authController from "../controllers/authControllers.js";
import { loginSchema, registerSchema } from "../models/user.js";
//import schemas from "../models/user.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register
);

authRouter.post("/login", validateBody(loginSchema), authController.login);

export default authRouter;
