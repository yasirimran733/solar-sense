import express from "express"
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from "../controllers/ProductController.js";
const router = express.Router();

router.post("/", createProduct)
router.get("/", getAllProducts)
router.get("/:sku", getProduct)
router.put("/:sku", updateProduct)
router.delete("/:sku", deleteProduct)


export default router