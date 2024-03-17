import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

const { SECRET_KEY, BASE_URL } = process.env;

async function register(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `To confirm your registration, please click on the <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Link</a>`,
    text: `To confirm your registration, please open the link ${BASE_URL}/api/users/verify/${verificationToken} `,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "Not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "missing required field email");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user === null) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (user.verify === false) {
    throw HttpError(401, "Your account is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
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

async function updateAvatar(req, res, next) {
  try {
    const img = await Jimp.read(req.file.path);
    await img.resize(250, 250).writeAsync(req.file.path);
    await fs.rename(
      req.file.path,
      path.join(process.cwd(), "public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `${/avatars/}${req.file.filename}` },
      { new: true }
    );

    res.send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
