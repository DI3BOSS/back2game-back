import { Router } from "express";
import endpoints from "../../constants/endpoints.js";
import {
  createGame,
  deleteGame,
  getGameById,
  getGames,
} from "../../controllers/gamesControllers/gamesControllers.js";
import auth from "../../middlewares/auth/auth.js";

const gamesRouter = Router();

gamesRouter.get(endpoints.root, getGames);
gamesRouter.delete(`${endpoints.delete}${endpoints.idParam}`, auth, deleteGame);
gamesRouter.post(endpoints.create, auth, createGame);
gamesRouter.get(`${endpoints.getById}${endpoints.gameId}`, getGameById);

export default gamesRouter;
