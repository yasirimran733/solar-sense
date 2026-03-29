import React, { useCallback, useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Loader from "../components/ui/Loader";
import { fetchLowStockProducts } from "../api/dashboardApi";
import { formatCurrency } from "../utils/format";
import { getApiErrorMessage } from "../utils/apiError";
import { notifyError } from "../components/ui/notify";

export default function LowStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLowStockProducts();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Could not load low stock products."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onSale = () => load();
    window.addEventListener("pos:sale-created", onSale);
    return () => window.removeEventListener("pos:sale-created", onSale);
  }, [load]);

  const columns = [
    { key: "name", header: "Product" },
    { key: "sku", header: "SKU" },
    {
      key: "quantity",
      header: "Qty",
      render: (row) => <span className="font-semibold text-red-600">{row.quantity}</span>,
    },
    {
      key: "sale_price",
      header: "Sale price",
      render: (row) => formatCurrency(row.sale_price),
    },
    { key: "category", header: "Category", render: (row) => row.category || "—" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Card title="Low stock" subtitle="Products at or below 5 units. Restock soon.">
        {loading ? (
          <Loader label="Loading..." />
        ) : (
          <Table
            columns={columns}
            rows={products}
            keyExtractor={(r) => r._id || r.sku}
            emptyMessage="All products are sufficiently stocked."
          />
        )}
      </Card>
    </div>
  );
}
