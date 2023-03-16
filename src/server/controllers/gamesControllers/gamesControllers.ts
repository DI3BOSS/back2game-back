import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Game from "../../../database/models/Game.js";
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
