import { type Response, type Request, type NextFunction } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError.js";
import connectToDatabase from "../../../database/connectToDataBase.js";
import Game from "../../../database/models/Game.js";
import {
  type GamesStructure,
  type CustomAuthRequest,
  type CustomCreateGameAuthRequest,
} from "../../../types.js";
import errors from "../../constants/errors.js";
import successes from "../../constants/successes.js";
import {
  createGame,
  deleteGame,
  getGameById,
  getGames,
} from "./gamesControllers.js";

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

const mockedGames: GamesStructure = [
  {
    title: "Legend of Dragoon",
    platform: "PS5",
    genre: "RPG",
    description: "",
    price: "9.99",
    cover: "legend_of_dragon.png",
    id: "1",
    owner: "di3boss",
  },
  {
    title: "Gran Turismo 7",
    platform: "PS5",
    genre: "Simulation",
    description: "",
    price: "69.99",
    cover: "Gran_Turismo.jpg",
    id: "2",
    owner: "di3boss",
  },
];

beforeEach(() => jest.restoreAllMocks());

describe("Given the GET 'games' endpoint", () => {
  const response: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockResolvedValue(mockedGames),
  };

  const request: Partial<Request> = {};

  const next: NextFunction = jest.fn();

  describe("When it receives a request from a user", () => {
    test("Then it should calls its status method with 200 code", async () => {
      const expectedCodeStatus = successes.ok.statusCode;

      Game.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockedGames),
      }));

      await getGames(request as Request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(expectedCodeStatus);
    });
  });

  describe("When it receives a wrong request from a user", () => {
    test(" its next method with a message 'Internal Server Error: Couldn't retrieve games.'", async () => {
      const gameGamesResult = false;

      Game.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(gameGamesResult),
      }));

      const expectedError = new CustomError(
        errors.serverError.message,
        errors.serverError.statusCode,
        errors.serverError.gamesMessage
      );

      await getGames(request as Request, response as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the DELETE 'game' endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should delete a game an give status code '200'", async () => {
      const request: Partial<CustomAuthRequest> = {
        params: { id: `${mockedGames[0].id}` },
      };
      const response: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(mockedGames[0].id),
      };
      const next = jest.fn();
      const expectedStatusCode = successes.ok.statusCode;

      Game.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockedGames[0]),
      }));

      await deleteGame(
        request as CustomAuthRequest,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives a request that can't pass through auth", () => {
    test("Then it should call the next function", async () => {
      jest.restoreAllMocks();

      const request: Partial<CustomAuthRequest> = {};
      request.params = {};

      const response: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };

      const next: NextFunction = jest.fn();

      const error = new CustomError(
        errors.unauthorized.message,
        errors.unauthorized.statusCode,
        errors.unauthorized.publicMessage
      );

      Game.findByIdAndDelete = jest.fn().mockReturnValue(undefined);

      await deleteGame(
        request as CustomAuthRequest,
        response as Response,
        next
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given the createGame controller", () => {
  const expectedCodeStatus = 201;

  const response: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
  };
  const request: Partial<Request> = {
    body: mockedGames[0],
  };

  const next: NextFunction = jest.fn();
  describe("When it receives a request", () => {
    test("Then it should create a game with status code '201'", async () => {
      Game.create = jest.fn().mockImplementationOnce(() => ({
        exec: jest
          .fn()
          .mockResolvedValue(mockedGames[0] as CustomCreateGameAuthRequest),
      }));

      await createGame(
        request as CustomAuthRequest,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedCodeStatus);
    });
  });
});

describe("Given the getGameById controller", () => {
  describe("When it receives a request with an id requesting a game", () => {
    test("Then it should call its status method with status code 200", async () => {
      const expectedCodeStatus = 200;
      const request: Partial<Request> = {};

      const response: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({}),
      };

      const next = jest.fn();

      request.params = { _id: mockedGames[0].id };

      Game.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({ _id: mockedGames[0].id }),
      }));

      await getGameById(request as Request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(expectedCodeStatus);
    });
  });

  describe("When it receives a request with a wrong game id", () => {
    test("Then it should call the next function with an error", async () => {
      const request: Partial<Request> = {};
      request.params = {};

      const response: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({}),
      };

      const next = jest.fn();

      Game.findOne = jest.fn().mockReturnValue(undefined);

      await getGameById(request as Request, response as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
