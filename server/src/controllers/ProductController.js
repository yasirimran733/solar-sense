import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    const { name, sku, sale_price, purchase_price } = req.body;

    if (!name || !sku || !sale_price || !purchase_price) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    try {
        const findProduct = await Product.findOne({ "sku": sku });

        if (findProduct) {
            return res.status(400).json({
                message: "Product already Exists with same sku."
            });
        }
        const product = new Product(req.body)
        const saved = await product.save();
        res.status(200).json({ success: true, product: saved, message: "Product Created Succesfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getAllProducts = async (req, res) => {
    const username = req.user.username;

    console.log(username)

    try {
        const products = await Product.find();
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found." })
        }
        res.status(200).json({ success: true, products: products })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getProduct = async (req, res) => {
    const { sku } = req.params;
    try {
        const product = await Product.findOne({ "sku": sku });
        console.log(typeof (product))
        if (!product) {
            return res.status(404).json({ message: "No product found." })
        }
        res.status(200).json({ success: true, product: product })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const updateProduct = async (req, res) => {
    const { sku } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "No data provided for update" });
    }

    try {
        const product = await Product.findOneAndUpdate({ sku: sku }, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: "No product found." })
        }
        res.status(200).json({ success: true, product: product, message: "Product Updated Succesfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteProduct = async (req, res) => {
    const { sku } = req.params;
    try {
        const product = await Product.findOneAndDelete({ "sku": sku });
        if (!product) {
            return res.status(404).json({ message: "No product found." })
        }
        res.status(200).json({ success: true, product: product, message: "Product Deleted Succesfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}


export const searchProduct = async (req, res) => {
    const { q } = req.query;

    console.log("Query :", q)
    if (!q) {
        return res.status(200).json([]);
    }

    try {
        const products = await Product.findOne({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { sku: { $regex: q, $options: "i" } }
            ]
        }).limit(5);

        res.status(200).json({ success: true, products: products, message: "Product Returned Succesfully" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }

}