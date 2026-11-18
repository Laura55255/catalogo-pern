-- Esquema del catálogo de productos (HU01)

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Datos de ejemplo (ficticios)
INSERT INTO products (name, price, image) VALUES
  ('Camiseta básica', 199.00, 'https://picsum.photos/seed/camiseta/400/300'),
  ('Taza de cerámica', 89.50, 'https://picsum.photos/seed/taza/400/300');cat database/schema.sql
  