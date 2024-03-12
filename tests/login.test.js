import supertest from "supertest";
import mongoose from "mongoose";
import app from "../index.js";
import User from "../models/user.js";
import { response } from "express";

mongoose.set("strictQuery", false);
const { DB_TEST_URI, PORT = 8080 } = process.env;

mongoose
  .connect(DB_TEST_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((error) => {
    console.log("Database connection error", error);
    process.exit(1);
  });
describe("login", () => {
  test("test response status and token", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "Anastasiia@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.token).toBe(response.body.user.token);
    expect(response.body).toEqual({
      user: {
        email: "Anastasiia@gmail.com",
        subscription: "starter",
      },
    });
  });
});
