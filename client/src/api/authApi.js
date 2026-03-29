import axiosInstance from "./axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const loginUser = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
}