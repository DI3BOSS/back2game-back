import { Router } from "express";
import endpoints from "../constants/endpoints.js";
import { getGames } from "../controllers/gamesControllers/gamesControllers.js";

const gamesRouter = Router();

gamesRouter.get(endpoints.root, getGames);

export default gamesRouter;
