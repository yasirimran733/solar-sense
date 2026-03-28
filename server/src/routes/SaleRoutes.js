import express from "express"
import { createSale, getSale } from "../controllers/SaleController.js";
const router = express.Router();

router.post("/", createSale)
router.get("/:id", getSale)

export default router