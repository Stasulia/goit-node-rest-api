import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

async function register(req, res) {
const newUser = await User.create(req.body);
res.json({
    email: newUser,email,
    name: newUser.name})
}

export default register