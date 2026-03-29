import axiosInstance from "./axiosInstance";

/**
 * @param {{ items: { productSKU: string, quantity: number }[] }} payload
 */
export const createSale = async (payload) => {
  const { data } = await axiosInstance.post("/sales", payload);
  return data;
};

export const fetchSales = async () => {
  const { data } = await axiosInstance.get("/sales");
  return data;
};

export const fetchSaleById = async (id) => {
  const { data } = await axiosInstance.get(`/sales/${encodeURIComponent(id)}`);
  return data;
};
