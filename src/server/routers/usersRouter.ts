import { Router } from "express";
import { validate } from "express-validation";
import { logInUser } from "../controllers/usersControllers/usersControllers.js";
import logInUserSchema from "../schemas/logInUserSchema.js";
import endpoints from "../constants/endpoint.js";

const usersRouter = Router();

usersRouter.post(
  endpoints.login,
  validate(logInUserSchema, {}, { abortEarly: false }),
  logInUser
);

export default usersRouter;
