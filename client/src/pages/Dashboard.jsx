import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import { fetchDashboardSummary, fetchLowStockProducts } from "../api/dashboardApi";
import { fetchSales } from "../api/salesApi";
import { formatCurrency } from "../utils/format";
import { getApiErrorMessage } from "../utils/apiError";
import { notifyError } from "../components/ui/notify";

const ranges = [
  { id: "today", label: "Today" },
  { id: "weekly", label: "This week" },
  { id: "monthly", label: "This month" },
  { id: "custom", label: "Custom range" },
];

export default function Dashboard() {
  const [range, setRange] = useState("today");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

  const loadSummary = useCallback(async () => {
    if (range === "custom" && (!start || !end)) {
      setSummary(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params =
        range === "custom" && start && end
          ? { range: "custom", start, end }
          : { range };
      const data = await fetchDashboardSummary(params);
      if (data.success) {
        setSummary({
          totalProducts: data.totalProducts,
          totalSales: data.totalSales,
          totalProfit: data.totalProfit,
          totalInvoices: data.totalInvoices,
        });
      }
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Could not load dashboard summary."));
    } finally {
      setLoading(false);
    }
  }, [range, start, end]);

  const loadLowStock = useCallback(async () => {
    try {
      const data = await fetchLowStockProducts();
      setLowStock(Array.isArray(data.products) ? data.products : []);
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Could not load low stock."));
    }
  }, []);

  const loadTopSelling = useCallback(async () => {
    try {
      const data = await fetchSales();
      const sales = data.sales || [];
      const counts = new Map();
      for (const sale of sales) {
        for (const item of sale.items || []) {
          const key = item.productSKU;
          const prev = counts.get(key) || { sku: key, qty: 0, revenue: 0 };
          prev.qty += item.quantity;
          prev.revenue += item.price * item.quantity;
          counts.set(key, prev);
        }
      }
      const sorted = [...counts.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
      setTopSelling(sorted);
    } catch {
      setTopSelling([]);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadLowStock();
    loadTopSelling();
  }, [loadLowStock, loadTopSelling]);

  useEffect(() => {
    const onSale = () => {
      loadSummary();
      loadLowStock();
      loadTopSelling();
    };
    window.addEventListener("pos:sale-created", onSale);
    return () => window.removeEventListener("pos:sale-created", onSale);
  }, [loadSummary, loadLowStock, loadTopSelling]);

  const statCards = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Total products", value: summary.totalProducts },
      { label: "Total sales", value: formatCurrency(summary.totalSales) },
      { label: "Total profit", value: formatCurrency(summary.totalProfit) },
      { label: "Invoices", value: summary.totalInvoices },
    ];
  }, [summary]);

  const lowStockColumns = [
    { key: "name", header: "Product" },
    { key: "sku", header: "SKU" },
    {
      key: "quantity",
      header: "Qty",
      render: (row) => <span className="font-semibold text-amber-700">{row.quantity}</span>,
    },
    { key: "category", header: "Category", render: (row) => row.category || "—" },
  ];

  const topColumns = [
    { key: "sku", header: "SKU" },
    {
      key: "qty",
      header: "Units sold",
      render: (row) => <span className="font-medium">{row.qty}</span>,
    },
    {
      key: "revenue",
      header: "Revenue",
      render: (row) => formatCurrency(row.revenue),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-600">Sales performance and inventory health.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            {ranges.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          {range === "custom" && (
            <>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
              />
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
              />
              <Button type="button" onClick={() => loadSummary()} disabled={!start || !end}>
                Apply
              </Button>
            </>
          )}
        </div>
      </div>

      {loading && !summary ? (
        <Loader fullPage label="Loading dashboard..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label} className="border-amber-100/80 bg-white/90">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Low stock" subtitle="Products at or below 5 units">
          <Table
            columns={lowStockColumns}
            rows={lowStock}
            keyExtractor={(r) => r._id || r.sku}
            emptyMessage="All products are sufficiently stocked."
          />
        </Card>
        <Card title="Top selling SKUs" subtitle="By quantity across all invoices (loaded locally)">
          <Table
            columns={topColumns}
            rows={topSelling}
            keyExtractor={(r) => r.sku}
            emptyMessage="No sales data yet."
          />
        </Card>
      </div>
    </div>
  );
}
