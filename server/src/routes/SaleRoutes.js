import express from "express"
import { createSale } from "../controllers/SaleController.js";
const router = express.Router();

router.post("/", createSale)

export default router