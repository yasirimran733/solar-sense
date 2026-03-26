import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"

dotenv.config()
const app = express();
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Express is Running")
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Db Connected."))
.catch(err => console.log(err))

app.listen(5000, () => {
    console.log("Server is running.")
})
