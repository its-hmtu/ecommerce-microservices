import { RootState } from "../app/store";
import {useAppDispatch} from "../app/hooks";
import { addToCartAction, logOutAction, signInAction, updateUserAction } from "../features/counters/user.slice";
import { getUserLocalStorage, getUserCartLocalStorage } from "../utils/user.utils";


export default function useUser() {
  const dispatch = useAppDispatch()
  const user: RootState["user"] = { ...getUserLocalStorage() }
  const cart: RootState["user"]["cart"] = getUserCartLocalStorage()

  const addToCart = (data: any) => dispatch(addToCartAction(data))
  const login = (data: any) => dispatch(signInAction(data))
  const update = (update: any) => dispatch(updateUserAction(update))
  const logout = () => dispatch(logOutAction())

  return { user, cart, login, update, logout, addToCart }
}