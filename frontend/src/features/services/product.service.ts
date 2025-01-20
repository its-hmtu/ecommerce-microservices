import axiosClient from "../../api/axiosClient";
import { API_URL_GET_PRODUCTS } from "../../constants/api";

export default {
    getProducts: async () => {
        const response = await axiosClient.get(API_URL_GET_PRODUCTS);
        return response.data;
    }
}