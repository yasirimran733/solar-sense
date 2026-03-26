import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import helmet from "helmet"
import morgan from "morgan"
import ProductRoutes from "./routes/ProductRoutes.js"
import SaleRoutes from "./routes/SaleRoutes.js"

dotenv.config()
const app = express();
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))

const PORT = process.env.PORT || 5000;

app.use("/api/products", ProductRoutes)
app.use("/api/sales/", SaleRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Db Connected."))
    .catch(err => console.log(err))

app.listen(PORT, () => {
    console.log("Server is running.")
})
