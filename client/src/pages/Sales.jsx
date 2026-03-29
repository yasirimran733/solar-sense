import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Loader from "../components/ui/Loader";
import { fetchSales } from "../api/salesApi";
import { formatCurrency, formatDate } from "../utils/format";
import { getApiErrorMessage } from "../utils/apiError";
import { notifyError } from "../components/ui/notify";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceFilter, setInvoiceFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSales();
      const list = (data.sales || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      setSales(list);
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Could not load sales."));
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

  const filtered = useMemo(() => {
    const inv = invoiceFilter.trim().toLowerCase();
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;
    if (toD) toD.setHours(23, 59, 59, 999);

    return sales.filter((s) => {
      if (inv && !String(s.invoiceNumber || "").toLowerCase().includes(inv)) return false;
      const d = new Date(s.date);
      if (fromD && d < fromD) return false;
      if (toD && d > toD) return false;
      return true;
    });
  }, [sales, invoiceFilter, from, to]);

  const columns = [
    {
      key: "invoiceNumber",
      header: "Invoice",
      render: (row) => <span className="font-mono text-sm font-semibold text-amber-800">{row.invoiceNumber}</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (row) => formatDate(row.date),
    },
    {
      key: "totalAmount",
      header: "Total",
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: "profit",
      header: "Profit",
      render: (row) => <span className="text-emerald-700">{formatCurrency(row.profit)}</span>,
    },
    {
      key: "items",
      header: "Lines",
      render: (row) => row.items?.length ?? 0,
    },
    {
      key: "invoice",
      header: "",
      className: "w-[1%] whitespace-nowrap text-right print:hidden",
      render: (row) =>
        row._id ? (
          <Link
            to={`/invoice/${row._id}`}
            className="text-sm font-semibold text-amber-700 underline-offset-2 hover:underline"
          >
            View / Print
          </Link>
        ) : null,
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card
        title="Sales & invoices"
        subtitle="Filter by invoice number or date range. Data is loaded from your server."
        actions={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder="Invoice #"
              value={invoiceFilter}
              onChange={(e) => setInvoiceFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
            />
            <span className="hidden text-gray-400 sm:inline">→</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
            />
          </div>
        }
      >
        {loading ? (
          <Loader label="Loading sales..." />
        ) : (
          <Table
            columns={columns}
            rows={filtered}
            keyExtractor={(r) => r._id}
            emptyMessage="No sales match your filters."
          />
        )}
      </Card>
    </div>
  );
}
