import express from "express"
import { createSale, getSale, getSales } from "../controllers/SaleController.js";
const router = express.Router();

router.post("/", createSale)
router.get("/", getSales)
router.get("/:id", getSale)

export default router