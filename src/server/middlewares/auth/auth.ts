import { type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import { type CustomAuthRequest } from "../../../types.js";
import errors from "../../constants/errors.js";
import { type CustomJwtPayload } from "../../controllers/types.js";

const auth = (
  request: CustomAuthRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const authorizationRequestHeader = request.header("Authorization");

    if (!authorizationRequestHeader) {
      throw new Error(errors.unauthorized.authHeaderMissing);
    }

    if (!authorizationRequestHeader.startsWith("Bearer ")) {
      throw new Error(errors.unauthorized.authBearerMissing);
    }

    const token = authorizationRequestHeader.replace(/^Bearer\s*/, "");

    const { sub: postedBy } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    request.postedBy = postedBy;

    next();
  } catch (error: unknown) {
    const tokenError = new CustomError(
      (error as Error).message,
      errors.unauthorized.statusCode,
      errors.unauthorized.authInvalidToken
    );
    next(tokenError);
  }
};

export default auth;
