import db from "../db.js";
import dayjs from "dayjs";

function generateObject(row) {
  const {
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customerName,
    gameName,
    categoryId,
    categoryName,
  } = row;

  return {
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customer: {
      id: customerId,
      name: customerName,
    },
    game: {
      id: gameId,
      name: gameName,
      categoryId,
      categoryName,
    },
  };
}

export async function getRentals(req, res) {
  const { offset, limit, customerId, gameId } = req.query;

  try {
    const params = [];
    const conditions = [];
    let where = "";

    if (customerId) {
      params.push(customerId);
      conditions.push(`rentals."customerId"=$${params.length}`);
    }

    if (gameId) {
      params.push(gameId);
      conditions.push(`rentals."gameId"=$${params.length}`);
    }

    if (params.length > 0) {
      where += `WHERE ${conditions.join(" AND ")}`;
    }

    const { rows: rentals } = await db.query(
      `
        SELECT 
          rentals.*,
          customers.name AS "customerName",
          games.name AS "gameName",
          categories.id AS "categoryId",
          categories.name AS "categoryName"
        FROM rentals
          JOIN customers ON customers.id=rentals."customerId"
          JOIN games ON games.id=rentals."gameId"
          JOIN categories ON categories.id=games."categoryId"
        ${where}
      `,
      params
    );

    res.send(rentals.map(generateObject));
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const rentDate = dayjs().format("YYYY-MM-DD");

  try {
    const { rows: dbPrice } = await db.query(
      `
        SELECT games."pricePerDay" FROM games WHERE id=$1
    `,
      [gameId]
    );

    await db.query(
      `
        INSERT INTO
            rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        null,
        dbPrice[0].pricePerDay * daysRented,
        null,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function returnRental(req, res) {
  const { id } = req.params;

  const currentDate = dayjs().format("YYYY-MM-DD");

  try {
    const { rows: dbRental } = await db.query(
      `
                SELECT * FROM rentals WHERE id=$1
    `,
      [id]
    );

    if (dbRental.length === 0) {
      return res.sendStatus(404);
    }

    if (dbRental[0].returnDate !== null) {
      return res.sendStatus(400);
    }

    const pricePerDay = dbRental[0].originalPrice / dbRental[0].daysRented;

    const rightReturnDate = dayjs(dbRental[0].rentDate).add(
      dbRental[0].daysRented,
      "day"
    );
    const delayDays = dayjs(currentDate).diff(rightReturnDate, "day");

    const delayFee = delayDays > 0 ? parseInt(delayDays) * pricePerDay : 0;

    console.log(delayFee);

    await db.query(
      `
        UPDATE rentals
            SET "returnDate"=$1, "delayFee"=$2
            WHERE id=$3
      `,
      [currentDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const { rows: dbRentals } = await db.query(
      `
      SELECT * FROM rentals WHERE id=$1
    `,
      [id]
    );

    if (dbRentals.length === 0) {
      return res.sendStatus(404);
    }

    if (dbRentals[0].returnDate !== null) {
      return res.sendStatus(404);
    }

    await db.query(
      `
      DELETE FROM rentals WHERE id=$1
    `,
      [id]
    );

    res.send("Deletado com sucesso!");
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}
