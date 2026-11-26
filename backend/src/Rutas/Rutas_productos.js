import { Router } from "express";
import { getProducts, createProduct, getProductById } from "../Controladores/CTRL_productos.js";

const router = Router();
router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
export default router;