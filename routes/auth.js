import express from "express";
import validateBody from "../helpers/validateBody.js";
import {schemas} from "../models/user.js"
import register from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(schemas.registerSchema), register)

export default authRouter;