import db from "../db.js";
import categorySchema from "../schemas/categorySchema.js";

export default async function createCategory(req, res) {
  const category = req.body;

  const validation = categorySchema.validate(category);
  if (validation.error) {
    return res.status(422).send("Schema inválido");
  }

  try {
    const dbCategory = await db.query(
      `
      SELECT * FROM 
        categories WHERE name=$1
    `,
      [category.name]
    );

    if (dbCategory.rowCount > 0) {
      return res.status(409).send(`Categoria já existe!`);
    }

    db.query(
      `
        INSERT INTO 
            categories (name) 
            VALUES ($1)
    `,
      [category.name]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}
