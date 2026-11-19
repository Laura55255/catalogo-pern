# Catálogo PERN

Aplicación para consultar, crear, editar y eliminar productos de un comercio pequeño.
Cada producto tiene identificador, nombre, precio e imagen (URL). **Todos los datos son ficticios.**

Proyecto de la Unidad 4 · TECNM Celaya · Ingeniería de Software.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite |
| API REST | Node.js + Express (cors, helmet, morgan) |
| Base de datos | PostgreSQL en Neon (`@neondatabase/serverless`) |

## Flujo de una operación

Ejemplo: consultar el catálogo (HU01).

1. **React** (`http://localhost:5173`) pide la lista de productos al cargar la pantalla.
2. La petición llega a **Express** como `GET /api/products`. La ruta (`Rutas_productos.js`) delega la atención al controlador (`CTRL_productos.js`).
3. El **controlador** ejecuta la consulta SQL en **PostgreSQL (Neon)**, que almacena los productos y aplica las restricciones del esquema (`price > 0`, campos `NOT NULL`).
4. Express responde **200** con JSON `{ "success": true, "data": [...] }`. Si la tabla está vacía, `data` es `[]`.
5. **React** muestra los productos o un estado vacío ("Aún no hay productos en el catálogo.").

```
React (5173) ──HTTP──▶ Express (3000) ──SQL──▶ PostgreSQL (Neon)
     ▲                                              │
     └──────────── JSON / estado HTTP ◀─────────────┘
```

## Requisitos

- Node.js 20 o superior y npm
- Cuenta en [Neon](https://neon.tech) con un proyecto PostgreSQL
- Git

## Variables de entorno

| Archivo | Variable | Descripción | Ejemplo |
|---------|----------|-------------|---------|
| `backend/.env` | `DATABASE_URL` | Cadena de conexión de Neon | `postgresql://usuario:postgresql://neondb_owner:npg_t0bzxKIH5eCV@ep-ancient-dew-bdpit2ko-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `frontend/.env` | `VITE_API_URL` | URL de la API que consume React | `http://localhost:3000` |

Los archivos `.env` están excluidos de Git. Nunca subas credenciales reales.

## Preparación de PostgreSQL (Neon)

1. Crea un proyecto en Neon y copia la cadena de conexión (botón **Connect**).
2. Abre el **SQL Editor** de Neon.
3. Ejecuta el contenido de `database/schema.sql`: crea la tabla `products` e inserta dos productos de ejemplo.
4. Verifica con `SELECT * FROM products;` (debe devolver 2 filas).

## Arranque en local

Backend:

```bash
cd backend
npm install
npm run dev
```

La API queda en `http://localhost:3000`.

Frontend (en otra terminal):

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

## Endpoints

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| GET | `/api/products` | Lista los productos | 200 |

Con datos:

```json
{ "success": true, "data": [ { "id": 2, "name": "Taza de cerámica", "price": "89.50", "image": "https://picsum.photos/seed/taza/400/300" } ] }
```

Con la tabla vacía:

```json
{ "success": true, "data": [] }
```

> POST, PUT y DELETE se agregan en las jornadas 2 a 4.

## Pruebas

### Manuales (Postman)

Petición: `GET http://localhost:3000/api/products`

| Caso | Resultado | Evidencia |
|------|-----------|-----------|
| Dos productos en la tabla | 200, `data` con 2 elementos | ![con datos](docs/evidencias/postman-con-datos.png) |
| Tabla vacía (`DELETE FROM products;`) | 200, `data: []` | ![tabla vacía](docs/evidencias/postman-tabla-vacia.png) |

### Automatizadas (Jest + Supertest)

```bash
cd backend
npm test
```

Las pruebas están en `backend/tests/productos.test.js` y simulan la base de datos, así que no necesitan conexión a Neon.

| Prueba | Resultado esperado |
|--------|--------------------|
| `GET /api/products` con dos productos | 200, `success: true`, 2 elementos en `data` |
| `GET /api/products` con la tabla vacía | 200, `{ "success": true, "data": [] }` |

## Equipo y tablero

- Tablero de GitHub Projects: _pegar enlace aquí_
- Flujo de tarjetas: Pendiente → Lista para iniciar → En desarrollo → En revisión → Liberada
- Etiquetas de incremento: `u4-j1`, `u4-j2`, …