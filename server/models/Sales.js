
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        required: true,
        min: 0
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
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;