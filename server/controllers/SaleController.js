import Sale from '../models/Sales.js'
import Product from '../models/Product.js'

export const createSale = async (req, res) => {
    const { items } = req.body;
    const salesItems = [];

    try {
        let totalAmount = 0;
        for (const item of items) {

            const product = await Product.findOne({ sku: item.productSKU })

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: "Product has less Quantity"
                });
            }

            product.quantity -= item.quantity;
            await product.save();
            totalAmount += (product.sale_price * item.quantity);

            salesItems.push({
                productSKU: item.productSKU,
                price: product.sale_price,
                quantity: item.quantity

            })
        };

        const sale = new Sale({
            totalAmount: totalAmount,
            items: salesItems,
        })

        await sale.save();

        res.status(200).json({ success: true, message: "Sale Created Succesfully", sale: sale })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}