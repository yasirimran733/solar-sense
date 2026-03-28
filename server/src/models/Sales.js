
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    profit: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [
        {
            productSKU: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
}, { timeseries: true });

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;