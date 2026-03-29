import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("auth/login", credentials);
  return data;
};

export const signupUser = async (payload) => {
  const { data } = await axiosInstance.post("auth/signup", payload);
  return data;
};
