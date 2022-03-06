import { Router } from "express";
import { createGame, getGames } from "../controllers/gameController.js";
import { gameMiddleware } from "../middlewares/gameMiddleware.js";

const gameRouter = Router();

gameRouter.get("/games", getGames);
gameRouter.post("/games", gameMiddleware, createGame);

export default gameRouter;
