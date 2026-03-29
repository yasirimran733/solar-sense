import axiosInstance from "./axiosInstance";

/**
 * @param {{ range?: string, start?: string, end?: string }} params
 */
export const fetchDashboardSummary = async (params = {}) => {
  const { data } = await axiosInstance.get("dashboard/summary", { params });
  return data;
};

export const fetchLowStockProducts = async () => {
  const { data } = await axiosInstance.get("dashboard/stock");
  return data;
};
