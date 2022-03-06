import db from "../db.js";
import gameSchema from "../schemas/gameSchema.js";

export async function gameMiddleware(req, res, next) {
  const game = req.body;

  if (parseInt(game.stockTotal) <= 0 || parseInt(game.pricePerDay) <= 0) {
    return res.sendStatus(400);
  }

  const validation = gameSchema.validate(game);
  if (validation.error) {
    return res.status(409).send("Schema inválido.");
  }

  try {
    const dbGame = await db.query(
      `
    SELECT * FROM games WHERE name=$1
`,
      [game.name]
    );

    console.log(dbGame);

    if (dbGame.rowCount > 0) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    return res.status(500).send(error);
  }
}
