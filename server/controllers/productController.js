import Product from "../models/db";

const newProduct = new Product(
    { "name": "Plate", "sku": "PLA-12-00", "sale_price": 5890, "purchase_price": 4566, "power": "6KW" }
)

await newProduct.save()