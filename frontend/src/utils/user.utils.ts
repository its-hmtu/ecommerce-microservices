import { RootState } from "../app/store";

export const getUserLocalStorage = (): RootState["user"] =>
  JSON.parse(localStorage.getItem("user") || "{}");

export const getUserCartLocalStorage = (): RootState["user"]["cart"] =>
  JSON.parse(localStorage.getItem("cart") || "[]");