import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Game from "../../../database/models/Game.js";
import {
  type CustomCreateGameAuthRequest,
  type CustomAuthRequest,
} from "../../../types.js";
import errors from "../../constants/errors.js";
import successes from "../../constants/successes.js";

export const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const games = await Game.find().exec();

    if (!games) {
      throw new CustomError(
        errors.serverError.message,
        errors.serverError.statusCode,
        errors.serverError.gamesMessage
      );
    }

    res.status(successes.ok.statusCode).json({ games });
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (
  req: CustomAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { idGame } = req.params;

  try {
    const game = await Game.findByIdAndDelete({
      _id: idGame,
      ownedBy: req.ownedBy,
    }).exec();

    res.status(successes.ok.statusCode).json({ game });
  } catch (error) {
    next(error);
  }
};

export const createGame = async (
  req: CustomAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, platform, genre, description, price, cover } =
      req.body as CustomCreateGameAuthRequest;

    const game = await Game.create({
      title,
      platform,
      genre,
      description,
      price,
      cover,
      owner: req.ownedBy,
    });

    res
      .status(successes.created.statusCode)
      .json(`Game ${game.title} susccessfully ${successes.created.message}`);
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const game = await Game.findById({ _id: id }).exec();

    res.status(successes.ok.statusCode).json({ game });
  } catch (error) {
    next(
      new CustomError(
        errors.unauthorized.message,
        errors.unauthorized.statusCode,
        errors.unauthorized.publicMessage
      )
    );
  }
};
