// Pruebas HU01 · GET /api/products
// Se simula la base de datos para no depender de Neon.
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

const sqlMock = jest.fn();

jest.unstable_mockModule("../src/Configuracion/Base_de_datos.js", () => ({
  sql: sqlMock,
}));

const { default: express } = await import("express");
const { default: request } = await import("supertest");
const { default: Rutas_productos } = await import("../src/Rutas/Rutas_productos.js");

// App de prueba con las mismas rutas que server.js (sin levantar el puerto 3000)
const app = express();
app.use("/api/products", Rutas_productos);

describe("GET /api/products (HU01)", () => {
  beforeEach(() => sqlMock.mockReset());

  test("con dos productos responde 200 y los devuelve en data", async () => {
    sqlMock.mockResolvedValue([
      { id: 2, name: "Taza de cerámica", price: "89.50", image: "https://picsum.photos/seed/taza/400/300" },
      { id: 1, name: "Camiseta básica", price: "199.00", image: "https://picsum.photos/seed/camiseta/400/300" },
    ]);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  test("con la tabla vacía responde 200 y data es una lista vacía", async () => {
    sqlMock.mockResolvedValue([]);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: [] });
  });
});