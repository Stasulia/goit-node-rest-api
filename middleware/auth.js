import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const { SECRET_KEY } = process.env;
async function auth(req, res, next) {
  // const authorizationHeader = req.headers.authorization;
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
    next(HttpError(401));
  }
}

export default auth;

// function auth(req, res, next) {
//   const authorizationHeader = req.headers.authorization;

//   if (typeof authorizationHeader === "undefined") {
//     return res.status(401).send({ message: "Invalid token" });
//   }

//   const [bearer, token] = authorizationHeader.split(" ", 2);

//   if (bearer !== "Bearer") {
//     return res.status(401).send({ message: "Invalid token" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
//     if (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(401).send({ message: "Token expired" });
//       }

//       return res.status(401).send({ message: "Invalid token" });
//     }

//     const user = await User.findById(decode.id);

//     if (user === null) {
//       return res.status(401).send({ message: "Invalid token" });
//     }

//     if (user.token !== token) {
//       return res.status(401).send({ message: "Invalid token" });
//     }

//     req.user = {
//       id: decode.id,
//       name: decode.name,
//     };

//     next();
//   });
// }

// export default auth;
