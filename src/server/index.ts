import express from "express";
import morgan from "morgan";
import cors from "cors";
import options from "./cors.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";
import endpoints from "./constants/endpoints.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import gamesRouter from "./routers/gamesRouter/gamesRouter.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());

app.use(endpoints.games, gamesRouter);
app.use(endpoints.users, usersRouter);

app.use(notFoundError);
app.use(generalError);
