import { type Request, type NextFunction, type Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import auth from "./auth.js";
import { type CustomAuthRequest } from "../../../types.js";
import CustomError from "../../../CustomError/CustomError";
import errors from "../../constants/errors.js";

const response: Partial<Response> = {};
const next: NextFunction = jest.fn();

describe("Given the token auth middleware", () => {
  describe("When it receives a request without an authorization header", () => {
    test("Then it should call the next function with and error status code 401 and message 'Authorization header missing'", () => {
      const request: Partial<CustomAuthRequest> = {
        header: jest.fn().mockReturnValue(undefined),
      };
      const expectedStatus = errors.unauthorized.statusCode;
      const expectedError = new CustomError(
        errors.unauthorized.authHeaderMissing,
        expectedStatus,
        errors.unauthorized.authInvalidToken
      );

      jwt.verify = jest.fn().mockReturnValueOnce({});

      auth(request as CustomAuthRequest, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request without an authorization Bearer method in the header", () => {
    test("Then it should call the next function with and error status code 401 and message 'Missing bearer in Authorization header'", () => {
      const mockedHeaderValue = "Header without Bearer";

      const request: Partial<CustomAuthRequest> = {
        header: jest.fn().mockReturnValue(mockedHeaderValue),
      };
      const expectedStatus = errors.unauthorized.statusCode;
      const expectedError = new CustomError(
        errors.unauthorized.authBearerMissing,
        expectedStatus,
        errors.unauthorized.authInvalidToken
      );
      jwt.verify = jest.fn().mockReturnValueOnce({});

      auth(request as CustomAuthRequest, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
