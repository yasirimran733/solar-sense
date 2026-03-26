import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "sku": {
        type: String,
        required: true,
        unique: true
    },
    "sale_price": {
        type: Number,
        required: true,
    },
    "purchase_price": {
        type: Number,
        required: true
    },
    "quantity": {
        type: Number,
        default: 0,
    },
    "size": String,
    "category": String,
    "power": String
})

const Product = mongoose.model("Product", productSchema)

export default Product;