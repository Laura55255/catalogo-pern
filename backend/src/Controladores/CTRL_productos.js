import { sql } from "../Configuracion/Base_de_datos.js";
import { productSchema } from "../validaciones/producto.schema.js";

const MAX_INT = 2147483647;

// Convierte el :id de la URL en entero válido; si no lo es, devuelve null
const parseId = (raw) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 && id <= MAX_INT ? id : null;
};

const notFound = (res) =>
  res.status(404).json({ success: false, error: "Producto no encontrado" });

const invalidData = (res, parsed) =>
  res.status(400).json({
    success: false,
    error: "Datos inválidos",
    details: parsed.error.issues.map((i) => ({
      campo: i.path.join("."),
      mensaje: i.message,
    })),
  });

export const getProducts = async (req, res) => {
  const data = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  res.status(200).json({ success: true, data });
};

// HU03: carga un producto por ID
export const getProductById = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return notFound(res);

  const [product] = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (!product) return notFound(res);

  res.status(200).json({ success: true, data: product });
};

export const createProduct = async (req, res) => {
  const parsed = productSchema.safeParse(req.body ?? {});
  if (!parsed.success) return invalidData(res, parsed);

  const { name, price, image } = parsed.data;
  const [product] = await sql`
    INSERT INTO products (name, price, image)
    VALUES (${name}, ${price}, ${image})
    RETURNING *`;

  res.status(201).json({ success: true, data: product });
};

// HU03: guarda el formulario completo
export const updateProduct = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return notFound(res);

  const parsed = productSchema.safeParse(req.body ?? {});
  if (!parsed.success) return invalidData(res, parsed);

  const { name, price, image } = parsed.data;
  const [product] = await sql`
    UPDATE products
    SET name = ${name}, price = ${price}, image = ${image}
    WHERE id = ${id}
    RETURNING *`;

  if (!product) return notFound(res);

  res.status(200).json({ success: true, data: product });
};