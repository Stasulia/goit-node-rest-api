import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const { SECRET_KEY } = process.env;
async function auth(req, res, next) {
  const { authorization = " " } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Email or password is wrong"));
    }
    req.user = user;
    next();
  } catch {
    next();
  }
}

export default auth;
