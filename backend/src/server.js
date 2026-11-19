import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Rutas_productos from "./Rutas/Rutas_productos.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/productos", Rutas_productos);

app.listen(3000, () => console.log("API en http://localhost:3000"));