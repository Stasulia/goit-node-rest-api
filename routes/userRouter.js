import express from "express";
import validateBody from "../helpers/validateBody.js";
import authController from "../controllers/authControllers.js";
import { emailSchema, loginSchema, registerSchema } from "../models/user.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const userRouter = express.Router();
const jsonParser = express.json();

userRouter.post(
  "/register",
  //jsonParser,
  validateBody(registerSchema),
  authController.register
);

userRouter.get("/verify/:verificationToken", authController.verifyEmail);

userRouter.post(
  "/verify",
  validateBody(emailSchema),
  authController.resendVerifyEmail
);

userRouter.post(
  "/login",
  //jsonParser,
  validateBody(loginSchema),
  authController.login
);
userRouter.get("/current", auth, authController.getCurrent);

userRouter.post("/logout", auth, authController.logout);

userRouter.patch(
  "/avatars",
  auth,
  upload.single("avatars"),
  authController.updateAvatar
);

export default userRouter;
