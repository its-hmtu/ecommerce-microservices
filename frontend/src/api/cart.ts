import api from ".";

export const getCart = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("user") as string).user._id;
    const response = await api.get(`/cart/${userId}`);
    if (response.status !== 200) {
      console.log(response);
      throw new Error(response.statusText);
    }
    return response.data;
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const addToCart = async ({
  productId,
  quantity,
  name,
  image,
  price
}: {
  productId: string;
  quantity: number;
  name: string;
  image: string;
  price: number;
}) => {
  try {
    const userId = JSON.parse(localStorage.getItem("user") as string).user._id;
    const response = await api.post('/cart', {
      productId,
      userId,
      quantity,
      name,
      image,
      price
    })

    if (response.status !== 200) {
      console.log(response);
      throw new Error(response.statusText);
    }

    return response.data;
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const emptyCart = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("user") as string).user._id;
    const response = await api.delete(`/cart/${userId}`);

    if (response.status !== 200) {
      console.log(response);
      throw new Error(response.statusText);
    }

    return response.data;
  } catch (e: any) {
    throw new Error(e.message)
  }
}