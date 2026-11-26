import { Router } from "express";
import {getProducts,getProductById,createProduct,updateProduct,} from "../Controladores/CTRL_productos.js";

const router = Router();
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
export default router;