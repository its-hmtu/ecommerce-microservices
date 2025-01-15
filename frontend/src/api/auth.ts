import api from ".";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.status !== 200) {
      console.log(response);
      throw new Error(response.statusText);
    }
    return response.data;
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const register = async (email: string, password: string, name: string) => {
  try {
    const response = await api.post("/auth/register", { email, password, name });
    if (response.status !== 200) {
      console.log(response);
      throw new Error(response.statusText);
    }
    return response.data;
  } catch (e: any) {
    throw new Error(e.message)
  }
}