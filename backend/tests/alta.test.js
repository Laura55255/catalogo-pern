// Pruebas HU02  POST /api/products
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
app.use(express.json());
app.use("/api/products", Rutas_productos);

const IMG = "https://picsum.photos/seed/gorra/400/300";

describe("POST /api/products (HU02)", () => {
  beforeEach(() => sqlMock.mockReset());

  test("alta válida responde 201 y devuelve el producto creado", async () => {
    sqlMock.mockResolvedValue([
      { id: 3, name: "Gorra", price: "120.00", image: IMG },
    ]);

    const res = await request(app)
      .post("/api/products")
      .send({ name: "  Gorra  ", price: 120, image: IMG });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(3);
    expect(sqlMock).toHaveBeenCalledTimes(1);
    // El nombre se guarda sin espacios (trim): primer valor de la consulta
    expect(sqlMock.mock.calls[0][1]).toBe("Gorra");
  });

  test("precio inválido responde 400 y no inserta ningún registro", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Gorra", price: -5, image: IMG });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(sqlMock).not.toHaveBeenCalled();
  });
});