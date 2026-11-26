// Pruebas HU04 · DELETE /api/products/:id
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
const gorra = { id: 1, name: "Gorra azul", price: "150.00", image: IMG };

describe("DELETE /api/products/:id (HU04)", () => {
  beforeEach(() => sqlMock.mockReset());

  test("confirmar eliminación responde 200 y devuelve el producto eliminado", async () => {
    sqlMock.mockResolvedValue([gorra]);

    const res = await request(app).delete("/api/products/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });

  test("tras eliminar, el producto ya no aparece en la lista ni se puede consultar", async () => {
    // Estado simulado de la tabla: el DELETE realmente lo quita
    let tabla = [gorra];
    sqlMock.mockImplementation(async (strings, ...vals) => {
      const q = strings.join("?");
      if (q.includes("DELETE")) {
        const borrado = tabla.filter((p) => p.id === vals[0]);
        tabla = tabla.filter((p) => p.id !== vals[0]);
        return borrado;
      }
      if (q.includes("WHERE id")) return tabla.filter((p) => p.id === vals[0]);
      return tabla;
    });

    await request(app).delete("/api/products/1").expect(200);

    const lista = await request(app).get("/api/products");
    expect(lista.body.data).toEqual([]);
    await request(app).get("/api/products/1").expect(404);
  });

  test("ID inexistente (ya eliminado) responde 404", async () => {
    sqlMock.mockResolvedValue([]);

    const res = await request(app).delete("/api/products/9999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("segundo DELETE del mismo ID responde 404", async () => {
    sqlMock.mockResolvedValueOnce([gorra]).mockResolvedValueOnce([]);

    await request(app).delete("/api/products/1").expect(200);
    await request(app).delete("/api/products/1").expect(404);
  });

  test("ID no numérico responde 404 sin tocar la base de datos", async () => {
    const res = await request(app).delete("/api/products/abc");

    expect(res.status).toBe(404);
    expect(sqlMock).not.toHaveBeenCalled();
  });
});