import express from "express";
import morgan from "morgan";
import cors from "cors";
import options from "./cors.js";
import gamesRouter from "./routers/gamesRouter.js";
import usersRouter from "./routers/usersRouter.js";
import { generalError, notFoundError } from "./middlewares/errorMiddlewares.js";

const gamesEndpoint = "/games";
const usersEndpoint = "/users";

export const app = express();

app.disable("x-powered-by");

app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());

app.use(gamesEndpoint, gamesRouter);
app.use(usersEndpoint, usersRouter);

app.use(notFoundError);
app.use(generalError);
