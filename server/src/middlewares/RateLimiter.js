import rateLimit from "../config/upstach.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await rateLimit.limit("my-limit")
        if (!success) {
            return res.status(429).json({ message: "Too many requests." })
        }
        next();
    } catch (error) {
        console.log("Rate Limit error", error)
    }

}

export default rateLimiter