import { type NextFunction, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../../database/models/User.js";
import { type CustomRequest } from "../../../types.js";
import { type CustomJwtPayload } from "../types.js";
import errors from "../../constants/errors.js";
import successes from "../../constants/successes.js";
import CustomError from "../../../CustomError/CustomError.js";

export const loginUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      throw new CustomError(
        errors.unauthorized.message,
        errors.unauthorized.statusCode,
        errors.unauthorized.publicMessage
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError(
        errors.unauthorized.message,
        errors.unauthorized.statusCode,
        errors.unauthorized.wrongCredentialsMessage
      );
    }

    const jsonWebTokenPayload: CustomJwtPayload = {
      sub: user._id.toString(),
      username: user.username,
    };

    const token = jwt.sign(jsonWebTokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "3d",
    });

    res.status(successes.ok.statusCode).json({ token });
  } catch (error) {
    next(error);
  }
};
