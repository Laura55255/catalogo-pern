import { Router } from "express";
import { getProducts } from "../Controladores/CTRL_productos.js";

const router = Router();
router.get("/", getProducts);
export default router;