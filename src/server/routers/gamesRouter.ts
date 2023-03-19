import { Router } from "express";
import endpoints from "../constants/endpoints.js";
import {
  createGame,
  deleteGame,
  getGames,
} from "../controllers/gamesControllers/gamesControllers.js";
import auth from "../middlewares/auth/auth.js";

const gamesRouter = Router();

gamesRouter.get(endpoints.root, getGames);
gamesRouter.delete(`${endpoints.delete}${endpoints.idParam}`, auth, deleteGame);
gamesRouter.post(endpoints.create, auth, createGame);

export default gamesRouter;
