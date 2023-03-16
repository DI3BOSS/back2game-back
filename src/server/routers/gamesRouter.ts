import { Router } from "express";
import { getGames } from "../controllers/gamesControllers/gamesControllers.js";

const gamesRouter = Router();

gamesRouter.get("/", getGames);

export default gamesRouter;
