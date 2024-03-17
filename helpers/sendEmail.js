import "dotenv/config";
import nodemailer from "nodemailer";


const { META_USER, META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_USER,
    pass: META_PASSWORD,
  },
};

const sendEmail = async (data) => {
  const transport = nodemailer.createTransport(nodemailerConfig);
  const email = { ...data, from: "anastasiia_masteriuk@meta.ua" };

  transport
    .sendMail(email)
    .then(() => console.log("Email send succsess"))
    .catch((error) => console.log(error.message));
};

export default sendEmail;
