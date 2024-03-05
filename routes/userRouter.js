import express from "express";
import validateBody from "../helpers/validateBody.js";
import authController from "../controllers/authControllers.js";
import { loginSchema, registerSchema } from "../models/user.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();
//const jsonParser = express.json();

userRouter.post(
  "/register",
  //jsonParser,
  validateBody(registerSchema),
  authController.register
);

userRouter.post(
  "/login",
  //jsonParser,
  validateBody(loginSchema),
  authController.login
);
userRouter.get("/current", auth, authController.getCurrent);

userRouter.post("/logout", auth, authController.logout);

export default userRouter;
