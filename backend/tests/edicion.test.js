// Pruebas HU03 · PUT /api/products/:id
// Se simula la base de datos para no depender de Neon.
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

const sqlMock = jest.fn();

jest.unstable_mockModule("../src/Configuracion/Base_de_datos.js", () => ({
  sql: sqlMock,
}));

const { default: express } = await import("express");
const { default: request } = await import("supertest");
const { default: Rutas_productos } = await import("../src/Rutas/Rutas_productos.js");

const app = express();
app.use(express.json());
app.use("/api/products", Rutas_productos);

const IMG = "https://picsum.photos/seed/gorra/400/300";

describe("PUT /api/products/:id (HU03)", () => {
  beforeEach(() => sqlMock.mockReset());

  test("edición válida responde 200 y devuelve el producto actualizado", async () => {
    sqlMock.mockResolvedValue([
      { id: 1, name: "Gorra azul", price: "150.00", image: IMG },
    ]);

    const res = await request(app)
      .put("/api/products/1")
      .send({ name: "Gorra azul", price: 150, image: IMG });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Gorra azul");
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });

  test("ID inexistente responde 404", async () => {
    sqlMock.mockResolvedValue([]);

    const res = await request(app)
      .put("/api/products/9999")
      .send({ name: "Gorra", price: 100, image: IMG });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("ID no numérico responde 404 sin tocar la base de datos", async () => {
    const res = await request(app)
      .put("/api/products/abc")
      .send({ name: "Gorra", price: 100, image: IMG });

    expect(res.status).toBe(404);
    expect(sqlMock).not.toHaveBeenCalled();
  });

  test("datos inválidos responde 400 y no modifica ningún registro", async () => {
    const res = await request(app)
      .put("/api/products/1")
      .send({ name: "", price: -1, image: "no-es-url" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(sqlMock).not.toHaveBeenCalled();
  });
});