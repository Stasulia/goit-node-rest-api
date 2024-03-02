import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { SECRET_KEY } = process.env;

async function register(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (user) {
    throw HttpError(409, "Email is already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
}
async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  //медод compare порівнює паролі(пароль який прийщов з фроненду(який ввів користувач та захешований пароль, якиц зберігаеться в базі дани-))
  //метод compare повертае тру або фолз
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: email,
      name: user.name,
    },
  });
}

async function getCurrent(req, res) {
  const { email, name } = req.user;
  res.status(200).json({
    email,
    name,
  });
}

async function logout(req, res) {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Logout success",
  });
}
// async function login(req, res, next) {
//   const { email, password } = req.body;

//   const normalizedEmail = email.toLowerCase();

//   try {
//     const user = await User.findOne({ email: normalizedEmail });

//     if (user === null) {
//       console.log("Email");
//       return res
//         .status(401)
//         .send({ message: "Email or password is incorrect" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (isMatch === false) {
//       console.log("Password");
//       return res
//         .status(401)
//         .send({ message: "Email or password is incorrect" });
//     }

//     res.send({ token: "TOKEN" });
//   } catch (error) {
//     next(error);
//   }
// }

//export default { register: ctrlWrapper(register), login: ctrlWrapper(login), getCurrent: ctrlWrapper(getCurrent) };
export default { register, login, getCurrent, logout };
