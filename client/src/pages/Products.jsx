import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";
import { getApiErrorMessage } from "../utils/apiError";
import { notifyError, notifySuccess } from "../components/ui/notify";

const emptyForm = {
  name: "",
  sku: "",
  sale_price: "",
  purchase_price: "",
  quantity: "0",
  size: "",
  category: "",
  power: "",
};

export default function Products() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products || []);
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Could not load products."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const blob = `${p.name} ${p.sku} ${p.category ?? ""} ${p.power ?? ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [products, filter]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name ?? "",
      sku: p.sku ?? "",
      sale_price: String(p.sale_price ?? ""),
      purchase_price: String(p.purchase_price ?? ""),
      quantity: String(p.quantity ?? "0"),
      size: p.size ?? "",
      category: p.category ?? "",
      power: p.power ?? "",
    });
    setModalOpen(true);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      sale_price: Number(form.sale_price),
      purchase_price: Number(form.purchase_price),
      quantity: Number(form.quantity) || 0,
      size: form.size.trim() || undefined,
      category: form.category.trim() || undefined,
      power: form.power.trim() || undefined,
    };
    try {
      if (editing) {
        const rest = { ...payload };
        delete rest.sku;
        await updateProduct(editing.sku, rest);
        notifySuccess("Product updated.");
      } else {
        await createProduct(payload);
        notifySuccess("Product created.");
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      notifyError(getApiErrorMessage(err, "Save failed."));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.sku);
      notifySuccess("Product deleted.");
      setDeleteTarget(null);
      await load();
    } catch (e) {
      notifyError(getApiErrorMessage(e, "Delete failed."));
    }
  }

  const columns = [
    { key: "name", header: "Name" },
    { key: "sku", header: "SKU" },
    {
      key: "sale_price",
      header: "Sale",
      render: (row) => formatCurrency(row.sale_price),
    },
    {
      key: "purchase_price",
      header: "Cost",
      render: (row) => formatCurrency(row.purchase_price),
    },
    { key: "quantity", header: "Stock" },
    {
      key: "actions",
      header: "",
      className: "w-[1%] whitespace-nowrap text-right",
      render: (row) => (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="py-1 text-xs"
            onClick={() => addItem(row, 1)}
            disabled={!row.quantity || row.quantity < 1}
          >
            Add to cart
          </Button>
          <Button type="button" variant="secondary" className="py-1 text-xs" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button type="button" variant="danger" className="py-1 text-xs" onClick={() => setDeleteTarget(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card
        title="Products"
        subtitle="Manage catalog, pricing, and stock."
        actions={
          <>
            <input
              type="search"
              placeholder="Search name, SKU, category..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <Button type="button" onClick={openCreate}>
              Add product
            </Button>
          </>
        }
      >
        {loading ? (
          <Loader label="Loading products..." />
        ) : (
          <Table
            columns={columns}
            rows={filtered}
            keyExtractor={(r) => r._id || r.sku}
            emptyMessage="No products match your filters."
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? "Edit product" : "New product"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="product-form" loading={saving}>
              Save
            </Button>
          </>
        }
      >
        <form id="product-form" className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="sm:col-span-2">
            <span className="text-xs font-medium text-gray-600">Name</span>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label>
            <span className="text-xs font-medium text-gray-600">SKU</span>
            <input
              name="sku"
              required
              disabled={Boolean(editing)}
              value={form.sku}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </label>
          <label>
            <span className="text-xs font-medium text-gray-600">Quantity</span>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label>
            <span className="text-xs font-medium text-gray-600">Sale price</span>
            <input
              name="sale_price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.sale_price}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label>
            <span className="text-xs font-medium text-gray-600">Purchase price</span>
            <input
              name="purchase_price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.purchase_price}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label>
            <span className="text-xs font-medium text-gray-600">Category</span>
            <input
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label>
            <span className="text-xs font-medium text-gray-600">Power</span>
            <input
              name="power"
              value={form.power}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs font-medium text-gray-600">Size</span>
            <input
              name="size"
              value={form.size}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete product?"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This will remove <strong>{deleteTarget?.name}</strong> ({deleteTarget?.sku}) permanently.
        </p>
      </Modal>
    </div>
  );
}
