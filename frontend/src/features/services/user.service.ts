import axiosClient from "../../api/axiosClient";
import { API_URL_GET_USER, API_URL_LOGIN, API_URL_REGISTER } from "../../constants/api";

export default {
    login: async (data: any) => await axiosClient.post(API_URL_LOGIN, data),
    register: async (data: any) => await axiosClient.post(API_URL_REGISTER, data),
    getUser: async () => await axiosClient.get(API_URL_GET_USER),
}