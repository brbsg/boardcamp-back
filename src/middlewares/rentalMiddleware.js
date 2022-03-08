import db from "../db.js";
import rentalSchema from "../schemas/rentalSchema.js";

export async function createRentalMiddleware(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  if (daysRented <= 0) {
    return res.sendStatus(400);
  }

  try {
    const { rows: gameExists } = await db.query(
      `
        SELECT * FROM games WHERE id=$1
    `,
      [gameId]
    );

    if (!gameExists) {
      return res.sendStatus(400);
    }

    const { rows: customerExists } = await db.query(
      `
        SELECT * FROM customers WHERE id=$1
    `,
      [customerId]
    );

    if (!customerExists) {
      return res.sendStatus(400);
    }

    const gameDetails = await db.query(
      `
        SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" is null
    `,
      [gameId]
    );

    const gameStock = gameExists.stockTotal;
    const gameRentals = gameDetails;

    if (gameStock - gameRentals === 0) {
      return res.sendStatus(400);
    }

    next();
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}
export async function returnRentalMiddleware(req, res, next) {
  try {
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}
