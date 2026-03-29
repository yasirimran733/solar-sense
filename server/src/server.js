import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import ProductRoutes from "./routes/ProductRoutes.js"
import SaleRoutes from "./routes/SaleRoutes.js"
import connectDb from "./config/db.js"
import rateLimiter from "./middlewares/RateLimiter.js"
import AuthRoutes from "./routes/AuthRoutes.js"
import DashBoardRoutes from "./routes/DashBoardRoutes.js"
import { protectedRoute } from "./middlewares/AuthMiddleware.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDist = path.join(__dirname, "../../client/dist")

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
app.use("/api/dashboard/", protectedRoute, DashBoardRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(clientDist, { index: false }))

    app.get("*", (req, res, next) => {
        if (req.originalUrl.startsWith("/api")) {
            return res.status(404).json({ success: false, message: "Not found" })
        }
        res.sendFile(path.join(clientDist, "index.html"), (err) => {
            if (err) next(err)
        })
    })
}

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running.")
    })
})
