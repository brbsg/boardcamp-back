import db from "../db.js";
import customerSchema from "../schemas/customerSchema.js";

export async function customerCreateMiddleware(req, res, next) {
  const customer = req.body;

  const validation = customerSchema.validate(customer);
  if (validation.error) {
    return res.status(409).send("Schema inválido.");
  }
  try {
    const dbCustomer = await db.query(
      `
        SELECT * FROM customers WHERE cpf=$1
    `,
      [customer.cpf]
    );

    if (dbCustomer.rowCount > 0) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function customerUpdateMiddleware(req, res, next) {
  const customer = req.body;
  const { id } = req.params;

  const validation = customerSchema.validate(customer);
  if (validation.error) {
    return res.status(409).send("Schema inválido.");
  }
  try {
    const { rows: dbCustomer } = await db.query(
      `
        SELECT * FROM customers WHERE cpf=$1
    `,
      [customer.cpf]
    );

    if (dbCustomer[0] && dbCustomer[0].id != id) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
