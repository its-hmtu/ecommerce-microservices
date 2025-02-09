import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface UserState {
  id: string;
  name: string;
  email: string;
  cart: any[];
  cartTotal: number;
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  cart: [],
  cartTotal: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, userId } = action.payload;
      console.log("Adding to cart", product, quantity, userId);
      const existingItemIndex = state.cart.findIndex(
        (item) => item.productId === product._id
      );

      let updatedCart;

      if (existingItemIndex !== -1) {
        // Update the quantity of the existing item
        updatedCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to the cart
        updatedCart = [
          ...state.cart,
          {
            productId: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
          },
        ];
      }

      const cartTotal = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      localStorage.setItem(
        "user",
        JSON.stringify({ ...state, cart: updatedCart, cartTotal })
      );
      return { ...state, cart: updatedCart, cartTotal };
    },
    signIn: (state, action) => {
      // localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload,
      };
    },
    logOut: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      return initialState;
    },
    updateUser: (state, action) => {
      const newData = { ...state, ...action.payload };
      localStorage.setItem("user", JSON.stringify(newData));
      return newData;
    },
  },
});

export const {
  addToCart: addToCartAction,
  signIn: signInAction,
  logOut: logOutAction,
  updateUser: updateUserAction,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectCartTotal = (state: RootState) => state.user.cartTotal;

export default userSlice.reducer;
