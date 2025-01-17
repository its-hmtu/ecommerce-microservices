import axiosClient from "./axiosClient";

export const login = async (data: { email: string, password: string}) => {
  return await axiosClient.post('/auth/login', data)
}