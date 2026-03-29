import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { useCart } from "../context/CartContext";
import { searchProducts } from "../api/productApi";
import { createSale } from "../api/salesApi";
import { formatCurrency } from "../utils/format";
import { getApiErrorMessage } from "../utils/apiError";
import { notifyError, notifySuccess } from "../components/ui/notify";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, totalAmount, addItem } = useCart();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState([]);
  const [searching, setSearching] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const runSearch = useCallback(async (q) => {
    const t = q.trim();
    if (t.length < 1) {
      setHits([]);
      return;
    }
    setSearching(true);
    try {
      const data = await searchProducts(t);
      const list = Array.isArray(data.products) ? data.products : data.products ? [data.products] : [];
      setHits(list);
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Search failed."));
      setHits([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => runSearch(query), 300);
    return () => clearTimeout(id);
  }, [query, runSearch]);

  async function handleCheckout() {
    if (!items.length) {
      notifyError("Cart is empty.");
      return;
    }
    setCheckoutLoading(true);
    try {
      const payload = {
        items: items.map((l) => ({
          productSKU: l.productSKU,
          quantity: l.quantity,
        })),
      };
      const data = await createSale(payload);
      if (data.success) {
        notifySuccess(`Invoice ${data.sale?.invoiceNumber ?? ""} created successfully.`);
        clearCart();
        window.dispatchEvent(new CustomEvent("pos:sale-created"));
        if (data.sale?._id) {
          navigate(`/invoice/${data.sale._id}`, { replace: true });
        }
      }
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Could not create sale."));
    } finally {
      setCheckoutLoading(false);
    }
  }

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.productSKU}</div>
        </div>
      ),
    },
    {
      key: "sale_price",
      header: "Unit price",
      render: (row) => formatCurrency(row.sale_price),
    },
    {
      key: "quantity",
      header: "Qty",
      render: (row) => (
        <input
          type="number"
          min={1}
          max={row.stock}
          value={row.quantity}
          onChange={(e) => updateQuantity(row.productSKU, e.target.value)}
          className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
        />
      ),
    },
    {
      key: "line",
      header: "Line total",
      render: (row) => formatCurrency(row.sale_price * row.quantity),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Button type="button" variant="ghost" className="py-1 text-xs text-red-600" onClick={() => removeItem(row.productSKU)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <div className="flex-1 space-y-6">
        <Card
          title="Add products"
          subtitle="Search by name or SKU — results from your catalog."
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          {searching && <Loader label="Searching..." />}
          {!searching && hits.length > 0 && (
            <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
              {hits.map((p) => (
                <li key={p.sku} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.sku} · {formatCurrency(p.sale_price)} · Stock {p.quantity}
                    </p>
                  </div>
                  <Button type="button" className="py-1.5 text-xs" onClick={() => addItem(p, 1)} disabled={!p.quantity}>
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Cart"
          subtitle="Adjust quantities before generating an invoice."
          actions={
            <Button type="button" variant="secondary" onClick={clearCart} disabled={!items.length || checkoutLoading}>
              Clear cart
            </Button>
          }
        >
          <Table
            columns={columns}
            rows={items}
            keyExtractor={(r) => r.productSKU}
            emptyMessage="No items in cart. Search and add products above."
          />
        </Card>
      </div>

      <div className="w-full shrink-0 lg:w-80">
        <Card className="sticky top-6 border-amber-100 bg-gradient-to-b from-white to-amber-50/40">
          <h3 className="text-lg font-semibold text-gray-900">Checkout</h3>
          <p className="mt-1 text-sm text-gray-600">Totals use current sale prices from inventory.</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items</span>
              <span className="font-medium">{items.length}</span>
            </div>
            <div className="flex justify-between border-t border-amber-100 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          <Button type="button" className="mt-6 w-full" loading={checkoutLoading} onClick={handleCheckout} disabled={!items.length}>
            Generate invoice
          </Button>
        </Card>
      </div>
    </div>
  );
}
