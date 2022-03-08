import db from "../db.js";

export async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      `
        UPDATE customers
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5
      `,
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getCustomer(req, res) {
  const { cpf, offset, limit } = req.query;
  const { id } = req.params;

  try {
    if (!cpf && !id && offset && limit) {
      const dbCustomer = await db.query(`
            SELECT *
            FROM customers
            ${offset && `OFFSET ${parseInt(offset)}`}
            ${limit && `LIMIT ${parseInt(limit)}`}
        `);

      if (dbCustomer.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.send(dbCustomer.rows);
    } else if (!cpf && id && offset && limit) {
      const dbCustomer = await db.query(
        `
            SELECT *
            FROM customers
            WHERE id=$1
            ${offset && `OFFSET ${parseInt(offset)}`}
            ${limit && `LIMIT ${parseInt(limit)}`}
        `,
        [id]
      );

      if (dbCustomer.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.send(dbCustomer.rows);
    } else if (!cpf && !id && !offset && !limit) {
      const dbCustomer = await db.query(`
                SELECT * FROM customers
      `);

      if (dbCustomer.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.send(dbCustomer.rows);
    } else if (cpf && offset && limit) {
      const dbCustomer = await db.query(
        `
              SELECT *
              FROM customers
              WHERE cpf LIKE ($1)
              ${offset && `OFFSET ${parseInt(offset)}`}
              ${limit && `LIMIT ${parseInt(limit)}`}
          `,
        [`${cpf}%`]
      );

      if (dbCustomer.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.send(dbCustomer.rows);
    } else if (!cpf && id && !offset && !limit) {
      const dbCustomer = await db.query(
        `
        SELECT *
        FROM customers
        WHERE id=$1
        `,
        [id]
      );

      if (dbCustomer.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.send(dbCustomer.rows);
    } else if (cpf && !id && !offset && !limit) {
      const dbCustomer = await db.query(
        `
            SELECT *
            FROM customers
            WHERE cpf LIKE ($1)
            `,
        [`${cpf}%`]
      );

      if (dbCustomer.rowCount === 0) {
        return res.sendStatus(404);
      }

      return res.send(dbCustomer.rows);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await db.query(
      `
        INSERT INTO
            customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
    `,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
