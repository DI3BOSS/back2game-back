import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../database/models/User.js";
import connectToDatabase from "../../database/connectToDataBase.js";
import { app } from "..";

let mongoBbServer: MongoMemoryServer;

beforeAll(async () => {
  mongoBbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongoBbServer.getUri();

  await connectToDatabase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoBbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST 'user/login' endpoint", () => {
  describe("When it receives a request with username 'di3boss' and password '123456789'", () => {
    test("Then it should response with status 200", async () => {
      const mockedUser = {
        username: "di3boss",
        password: "123456789",
        email: "di3boos@gmail.com",
      };
      const endpoint = "/users/login";

      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      }));
      const hashedpassword = await bcrypt.hash(mockedUser.password, 10);

      await User.create({
        ...mockedUser,
        password: hashedpassword,
        user: mockedUser.username,
        pass: mockedUser.password,
      });

      const response = await request(app).post(endpoint).send(mockedUser);

      expect(response.body).toHaveProperty("token");
    });
  });
});
