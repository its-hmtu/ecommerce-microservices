import api from ".";

export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    if (response.status !== 200) {
      console.log(response);
      throw new Error(response.statusText);
    }
    return response.data;
  } catch (e: any) {
    throw new Error(e.message)
  }
}