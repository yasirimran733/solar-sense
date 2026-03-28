import express from "express"
import { dashBoardSummary, lowStockProducts } from "../controllers/DashBoardController.js";

const router = express.Router();

router.get("/summary", dashBoardSummary)
router.get("/stock", lowStockProducts)

export default router