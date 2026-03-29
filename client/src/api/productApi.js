import axiosInstance from "./axiosInstance";

export const fetchProducts = async () => {
  const { data } = await axiosInstance.get("products");
  return data;
};

export const fetchProductBySku = async (sku) => {
  const { data } = await axiosInstance.get(`products/${encodeURIComponent(sku)}`);
  return data;
};

export const searchProducts = async (query) => {
  const q = String(query || "").trim();
  if (!q) {
    return { success: true, products: [] };
  }
  const { data } = await axiosInstance.get("products/search", { params: { q } });
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await axiosInstance.post("products", payload);
  return data;
};

export const updateProduct = async (sku, payload) => {
  const { data } = await axiosInstance.put(`products/${encodeURIComponent(sku)}`, payload);
  return data;
};

export const deleteProduct = async (sku) => {
  const { data } = await axiosInstance.delete(`products/${encodeURIComponent(sku)}`);
  return data;
};
