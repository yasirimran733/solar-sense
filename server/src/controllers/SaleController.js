import Sale from '../models/Sales.js'
import Product from '../models/Product.js'
import Counter from '../models/Counter.js'

const getNextInvoiceNumber = async () => {
    const today = new Date().toISOString().split("T")[0];
    const counter = await Counter.findOneAndUpdate(
        { date: today },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true }
    )

    const paddedSequence = String(counter.seq).padStart(3, "0")

    return `INV-${today}-${paddedSequence}`
}



export const createSale = async (req, res) => {
    const { items } = req.body;
    let profit = 0;
    const salesItems = [];
    let totalAmount = 0;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Sale must include at least one line item." });
    }

    try {
        const invoiceNumber = await getNextInvoiceNumber();
        for (const item of items) {

            const product = await Product.findOne({ sku: item.productSKU })

            if (!product) {
                return res.status(400).json({
                    message: `Product not found: ${item.productSKU}`,
                });
            }

            const qty = Math.max(0, Number(item.quantity) || 0);
            if (qty < 1) {
                return res.status(400).json({ message: "Each line item needs quantity >= 1." });
            }

            if (product.quantity < qty) {
                return res.status(400).json({
                    message: "Product has less Quantity"
                });
            }

            const salePrice = Number(product.sale_price);
            const purchasePrice = Number(product.purchase_price);
            const lineSale = (Number.isFinite(salePrice) ? salePrice : 0) * qty;
            const lineProfit =
                ((Number.isFinite(salePrice) ? salePrice : 0) -
                    (Number.isFinite(purchasePrice) ? purchasePrice : 0)) *
                qty;

            product.quantity -= qty;
            profit += lineProfit;
            await product.save();

            totalAmount += lineSale;

            salesItems.push({
                productSKU: item.productSKU,
                price: Number.isFinite(salePrice) ? salePrice : 0,
                quantity: qty,
            })
        };

        if (!Number.isFinite(profit) || !Number.isFinite(totalAmount)) {
            return res.status(500).json({ error: "Invalid sale totals computed." });
        }

        const sale = new Sale({
            totalAmount: totalAmount,
            items: salesItems,
            profit: profit,
            invoiceNumber: invoiceNumber,
        })

        await sale.save();

        res.status(200).json({ success: true, message: "Sale Created Succesfully", sale: sale })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const getSales = async (req, res) => {

    try {
        const sales = await Sale.find();

        if (!sales) {
            return res.status(404).json({
                message: "No sales found"
            });
        }

        res.status(200).json({ success: true, sales: sales })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }

}

export const getSale = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sale.findById(id);

        if (!sale) {
            return res.status(404).json({
                message: "No sale found"
            });
        }

        res.status(200).json({ success: true, sale: sale })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}