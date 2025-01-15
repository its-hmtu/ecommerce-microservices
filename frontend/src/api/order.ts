import api from ".";

export const createOrder = async (orderData: any) => {
  try {
    const response = await api.post("/orders", orderData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string).token}`,
      }
    });
    if (response.status !== 201) {
      console.log(response);
      throw new Error(response.statusText);
    }

    return response.data;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export const getOrders = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("user") as string).user._id;
    const response = await api.get(`/orders/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user") as string).token}`,
      }
    });

    if (response.status !== 200) {
      console.log(response);
      throw new Error(response.statusText);
    }

    return response.data;
  } catch (e: any) {
    throw new Error(e.message);
  }
}