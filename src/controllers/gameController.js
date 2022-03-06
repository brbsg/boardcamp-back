import db from "../db.js";

export async function getGames(req, res) {
  const { name, offset, limit } = req.query;
  console.log(req.query);

  try {
    if (!name && offset && limit) {
      const { rows: games } = await db.query(`
        SELECT
            games.*,
            categories.name AS "categoryName"
        FROM games
            JOIN categories ON games."categoryId"=category.id
        ${offset && `OFFSET ${parseInt(offset)}`}
        ${limit && `LIMIT ${parseInt(limit)}`}
    `);

      return res.send(games);
    } else if (name && offset && limit) {
      const { rows: games } = await db.query(
        `
            SELECT
                games.*,
                categories.name AS "categoryName"
            FROM games
            WHERE LOWER (name) LIKE LOWER ($1)
                JOIN categories ON games."categoryId"=category.id
            ${offset && `OFFSET ${parseInt(offset)}`}
            ${limit && `LIMIT ${parseInt(limit)}`}
        `,
        [`${name}%`]
      );

      res.send(games);
    } else if (!name && !offset && !limit) {
    }
    const { rows: games } = await db.query(`
              SELECT * FROM games
          `);

    res.send(games);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await db.query(
      `
        INSERT INTO
            games ("name", "image", "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)
    `,
      [name, image, parseInt(stockTotal), categoryId, parseInt(pricePerDay)]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}
