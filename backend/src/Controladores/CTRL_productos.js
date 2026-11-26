import { sql } from "../Configuracion/Base_de_datos.js";
import { productSchema } from "../validaciones/producto.schema.js";

export const getProducts = async (req, res) => {
  const data = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  res.status(200).json({ success: true, data });
};

export const createProduct = async (req, res) => {
  const parsed = productSchema.safeParse(req.body ?? {});

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Datos inválidos",
      details: parsed.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }

  const { name, price, image } = parsed.data;
  const [product] = await sql`
    INSERT INTO products (name, price, image)
    VALUES (${name}, ${price}, ${image})
    RETURNING *`;

  res.status(201).json({ success: true, data: product });
};