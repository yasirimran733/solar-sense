import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { fetchSaleById } from "../api/salesApi";
import { fetchProducts } from "../api/productApi";
import { formatCurrency, formatDate } from "../utils/format";
import { getApiErrorMessage } from "../utils/apiError";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";

const SHOP = {
  name: "Solar Sense Technologies",
  address: "Building #108, Mumtaz Market, opposite Chase up, Civil Lines, Gujranwala, Punjab",
  phone: "0339 7800009",
  whatsapp: "+92 325 9901888",
  email: "energies.sst@gmail.com",
};

export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [skuToName, setSkuToName] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [saleRes, productsRes] = await Promise.all([
        fetchSaleById(id),
        fetchProducts().catch(() => ({ products: [] })),
      ]);

      if (!saleRes?.success || !saleRes.sale) {
        setError(saleRes?.message || "Invoice not found.");
        setSale(null);
        return;
      }

      setSale(saleRes.sale);

      const map = {};
      for (const p of productsRes.products || []) {
        if (p?.sku) map[p.sku] = p.name || p.sku;
      }
      setSkuToName(map);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load invoice."));
      setSale(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-open print dialog once data is ready (brief delay so layout paints)
  useEffect(() => {
    if (!sale?._id) return;
    const timer = window.setTimeout(() => window.print(), 450);
    return () => window.clearTimeout(timer);
  }, [sale?._id]);

  const rows = useMemo(() => {
    if (!sale?.items) return [];
    return sale.items.map((item, i) => {
      const description = skuToName[item.productSKU] || item.productSKU;
      const lineTotal = item.price * item.quantity;
      return { index: i + 1, description, sku: item.productSKU, quantity: item.quantity, price: item.price, lineTotal };
    });
  }, [sale, skuToName]);

  const customerName = sale?.customerName;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-amber-50/30">
        <Loader fullPage label="Loading invoice..." />
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50/50 via-white to-amber-50/30 px-4">
        <p className="text-center text-gray-700">{error || "Invoice not found."}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate("/cart")}>
            <FaArrowLeft /> Back to cart
          </Button>
          <Button type="button" onClick={() => navigate("/sales")}>
            View sales
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-print-root min-h-screen bg-slate-100/80 py-6 print:bg-white print:py-0">
      {/* Toolbar: hidden when printing */}
      <div className="invoice-no-print mx-auto mb-6 flex w-full max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 print:hidden">
        <Button type="button" variant="secondary" onClick={() => navigate("/cart")}>
          <FaArrowLeft /> Back to POS
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate("/sales")}>
            All invoices
          </Button>
          <Button type="button" onClick={() => window.print()}>
            <FaPrint /> Print invoice
          </Button>
        </div>
      </div>

      {/* A4 sheet */}
      <article className="invoice-sheet mx-auto w-full max-w-[210mm] bg-white px-8 py-10 shadow-xl ring-1 ring-gray-200/80 print:max-w-none print:w-full print:px-[12mm] print:py-[10mm] print:shadow-none print:ring-0">
        {/* Header — Pakistan-style centered branding */}
        <header className="border-b-2 border-amber-500/90 pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <img
              src="/logo.jpg"
              alt={SHOP.name}
              className="h-24 max-w-[240px] object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/favicon.svg";
              }}
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-[26px]">{SHOP.name}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600">{SHOP.address}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-700 md:text-sm">
            <span>
              <span className="font-semibold text-gray-900">Phone:</span> {SHOP.phone}
            </span>
            <span>
              <span className="font-semibold text-gray-900">WhatsApp:</span> {SHOP.whatsapp}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-600 md:text-sm">
            <span className="font-semibold text-gray-900">Email:</span> {SHOP.email}
          </p>
        </header>

        {/* Invoice meta */}
        <section className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-lg font-bold text-amber-700">TAX INVOICE</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Solar equipment &amp; services</p>
          </div>
          <dl className="space-y-1 text-right text-sm sm:min-w-[220px]">
            <div className="flex justify-between gap-8 sm:justify-end sm:gap-12">
              <dt className="text-gray-500">Invoice #</dt>
              <dd className="font-mono font-bold text-gray-900">{sale.invoiceNumber}</dd>
            </div>
            <div className="flex justify-between gap-8 sm:justify-end sm:gap-12">
              <dt className="text-gray-500">Date</dt>
              <dd className="font-medium text-gray-900">{formatDate(sale.date)}</dd>
            </div>
            {customerName ? (
              <div className="flex justify-between gap-8 sm:justify-end sm:gap-12">
                <dt className="text-gray-500">Customer</dt>
                <dd className="font-medium text-gray-900">{customerName}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        {/* Line items */}
        <section className="mt-8">
          <div className="overflow-hidden rounded-lg border border-gray-300 print:rounded-none">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-left text-white print:bg-amber-600">
                  <th className="w-12 border-b border-amber-600/30 px-3 py-3 font-semibold print:border-gray-400">#</th>
                  <th className="border-b border-amber-600/30 px-3 py-3 font-semibold print:border-gray-400">Product</th>
                  <th className="w-24 border-b border-amber-600/30 px-3 py-3 text-right font-semibold print:border-gray-400">Qty</th>
                  <th className="w-28 border-b border-amber-600/30 px-3 py-3 text-right font-semibold print:border-gray-400">Price</th>
                  <th className="w-32 border-b border-amber-600/30 px-3 py-3 text-right font-semibold print:border-gray-400">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.sku}-${row.index}`} className="border-b border-gray-200 bg-white odd:bg-gray-50/80 print:odd:bg-white">
                    <td className="px-3 py-2.5 align-top text-gray-600">{row.index}</td>
                    <td className="px-3 py-2.5 align-top">
                      <span className="font-medium text-gray-900">{row.description}</span>
                      <span className="mt-0.5 block font-mono text-xs text-gray-500">SKU: {row.sku}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right align-top tabular-nums text-gray-800">{row.quantity}</td>
                    <td className="px-3 py-2.5 text-right align-top tabular-nums text-gray-800">{formatCurrency(row.price)}</td>
                    <td className="px-3 py-2.5 text-right align-top font-semibold tabular-nums text-gray-900">
                      {formatCurrency(row.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8 flex justify-end">
          <dl className="w-full max-w-xs text-sm sm:text-base">
            <div className="flex justify-between border-t-2 border-gray-900 pt-3">
              <dt className="font-bold text-gray-900">Total Amount</dt>
              <dd className="font-bold text-gray-900">{formatCurrency(sale.totalAmount)}</dd>
            </div>
          </dl>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-base font-semibold text-gray-800">Thank you for your business!</p>
          <p className="mt-2 text-xs text-gray-500">
            This is a computer-generated invoice. For queries, contact us via phone or WhatsApp.
          </p>
          <p className="mt-1 text-xs text-gray-400">Solar Sense Technologies · Gujranwala, Punjab</p>
        </footer>
      </article>
    </div>
  );
}
