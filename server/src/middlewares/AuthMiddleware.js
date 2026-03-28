import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

export const protectedRoute = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Token Does not Exists" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const secretKey = process.env.JWT_TOKEN;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Middleware:", error);
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
}