import Product from "../models/Product.js"
import Sale from "../models/Sales.js"

export const dashBoardSummary = async (req, res) => {
    const range = req.query.range || "today";
    let startDate = req.query.start ? new Date(req.query.start) : new Date(0);
    let endDate = req.query.end ? new Date(req.query.end) : new Date();

    if (range === "today") {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
    } else if (range === "weekly") {
        const now = new Date();
        const day = now.getDay(); // 0 (Sun) - 6 (Sat)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day); // start of week (Sunday)
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
    } else if (range === "monthly") {
        const now = new Date();
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // 1st day of month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
        startDate = req.query.start ? new Date(req.query.start) : new Date(0);
        endDate = req.query.end ? new Date(req.query.end) : new Date();
        endDate.setHours(23, 59, 59, 999);
    }

    try {
        const totalProducts = await Product.countDocuments();
        const summary = await Sale.aggregate([
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalProfit: { $sum: "$profit" },
                    totalInvoices: { $sum: 1 },
                }
            },
        ])

        res.status(200).json({
            success: true,
            totalProducts,
            totalSales: summary[0]?.totalSales || 0,
            totalProfit: summary[0]?.totalProfit || 0,
            totalInvoices: summary[0]?.totalInvoices || 0
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const lowStockProducts = async (req, res) => {
    try {

        const products = await Product.find({ quantity: { $lte: 5 } })

        if (products.length === 0) {
            return res.status(200).json({ success: true, message: "All products are in stock", products: [] })
        }

        res.status(200).json({ success: true, message: "Low Stock Products", products })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }

};