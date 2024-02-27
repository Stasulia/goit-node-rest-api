import mongoose from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
contactSchema.post("save", handleMongooseError);

export default mongoose.model("Contact", contactSchema);
