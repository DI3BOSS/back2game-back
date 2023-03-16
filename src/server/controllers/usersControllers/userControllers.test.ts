import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { type Response, type Request, type NextFunction } from "express";
import User from "../../../database/models/User.js";
import { logInUser } from "./usersControllers.js";
import { type CustomRequest } from "../../../types.js";
import connectToDatabase from "../../../database/connectToDataBase.js";
import errors from "../../constants/errors.js";
import successes from "../../constants/successes.js";
import CustomError from "../../../CustomError/CustomError.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given the POST 'users/login' endpoint", () => {
  const mockedUser = {
    username: "di3boss",
    password: "123456789",
    email: "",
  };

  let mockedHasedPasswordCompareResult = true;

  const request: Partial<Request> = {};

  const response: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  request.body = {
    username: mockedUser.username,
    password: mockedUser.password,
  };

  const next = jest.fn() as NextFunction;

  describe("When it receives a login request with username 'di3boss' and password '123456789'", () => {
    test("Then it should respond with status code '200' and its json method with a token", async () => {
      const { statusCode } = successes.ok;

      const expectedToken = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({
          ...request.body,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest
        .fn()
        .mockResolvedValue(mockedHasedPasswordCompareResult);
      jwt.sign = jest.fn().mockReturnValue(expectedToken.token);

      await logInUser(request as CustomRequest, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(statusCode);
      expect(response.json).toHaveBeenCalledWith(expectedToken);
    });
  });

  describe("when it receives a request with a password that doesn't exist in the database", () => {
    test("Then it should call its next method with a status code 401 and a message 'Unauthorized: User or password not found.", async () => {
      const mockedWrongUser = {
        username: "di3boss",
        password: "wr0ngPassw0rd",
        email: "",
      };

      const expectedCredentialsError = new CustomError(
        errors.unauthorized.message,
        errors.unauthorized.statusCode,
        errors.unauthorized.wrongCredentialsMessage
      );

      mockedHasedPasswordCompareResult = false;

      request.body = mockedWrongUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({
          ...request.body,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest
        .fn()
        .mockResolvedValue(mockedHasedPasswordCompareResult);

      await logInUser(request as CustomRequest, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedCredentialsError);
    });
  });

  describe("when it receives a request with a username that doesn't exist in the database", () => {
    test("Then it should call its next method with a status code 401 and a message 'Unauthorized: User or password not found.'", async () => {
      const mockedWrongUser = {
        username: "wr0ngUs3r",
        password: "123456789",
        email: "",
      };

      const expectedUnauthorizedError = new CustomError(
        errors.unauthorized.message,
        errors.unauthorized.statusCode,
        errors.unauthorized.publicMessage
      );

      const userFindOneResult = undefined;

      request.body = mockedWrongUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(userFindOneResult),
      }));

      mockedHasedPasswordCompareResult = true;

      bcrypt.compare = jest
        .fn()
        .mockResolvedValue(mockedHasedPasswordCompareResult);

      await logInUser(request as CustomRequest, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedUnauthorizedError);
    });
  });
});
