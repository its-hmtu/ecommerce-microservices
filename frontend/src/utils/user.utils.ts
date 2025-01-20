import { RootState } from "../app/store";

export const getUserLocalStorage = (): RootState["user"] =>
  JSON.parse(localStorage.getItem("user") || "{}");