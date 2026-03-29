/* eslint-disable react-refresh/only-export-components -- context + hook pattern */
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Cart line: mirrors backend sale line items (productSKU + quantity) with display fields.
 * @typedef {{ productSKU: string, name: string, sale_price: number, quantity: number, stock: number }} CartLine
 */

const CartContext = createContext(null);

function clampQty(q, max) {
  const n = Math.floor(Number(q));
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, max);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, qty = 1) => {
    if (!product?.sku) return;
    const stock = Number(product.quantity ?? 0);
    const salePrice = Number(product.sale_price ?? 0);
    const name = product.name ?? product.sku;
    const addQty = clampQty(qty, stock);

    setItems((prev) => {
      const idx = prev.findIndex((l) => l.productSKU === product.sku);
      if (idx === -1) {
        if (stock < 1) return prev;
        return [
          ...prev,
          {
            productSKU: product.sku,
            name,
            sale_price: salePrice,
            quantity: addQty,
            stock,
          },
        ];
      }
      const next = [...prev];
      const merged = next[idx].quantity + addQty;
      next[idx] = {
        ...next[idx],
        stock,
        sale_price: salePrice,
        name,
        quantity: clampQty(merged, stock),
      };
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productSKU, quantity) => {
    setItems((prev) =>
      prev
        .map((line) => {
          if (line.productSKU !== productSKU) return line;
          const q = clampQty(quantity, line.stock);
          return { ...line, quantity: q };
        })
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productSKU) => {
    setItems((prev) => prev.filter((l) => l.productSKU !== productSKU));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const totalAmount = items.reduce((sum, l) => sum + l.sale_price * l.quantity, 0);
    const lineCount = items.reduce((sum, l) => sum + l.quantity, 0);
    return { totalAmount, lineCount, itemCount: items.length };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      ...totals,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
