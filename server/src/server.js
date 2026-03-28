import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import ProductRoutes from "./routes/ProductRoutes.js"
import SaleRoutes from "./routes/SaleRoutes.js"
import connectDb from "./config/db.js"
import rateLimiter from "./middlewares/RateLimiter.js"
import AuthRoutes from "./routes/AuthRoutes.js"
import { protectedRoute } from "./middlewares/AuthMiddleware.js"

dotenv.config()
const app = express();

app.use(cors())
app.use(express.json())  // Middleware
app.use(helmet())
app.use(morgan("dev"))
app.use(rateLimiter);

const PORT = process.env.PORT || 5000;

app.use("/api/auth", AuthRoutes)
app.use("/api/products", protectedRoute, ProductRoutes)
app.use("/api/sales/", protectedRoute, SaleRoutes)

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running.")
    })
})
