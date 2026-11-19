import { sql } from "../Configuracion/Base_de_datos.js";

export const getProducts = async (req, res) => {
  const data = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  res.status(200).json({ success: true, data });
};