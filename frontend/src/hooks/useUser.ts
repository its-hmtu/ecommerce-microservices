import { RootState } from "../app/store";
import {useAppDispatch} from "../app/hooks";
import { logOutAction, signInAction, updateUserAction } from "../features/counters/user.slice";
import { getUserLocalStorage } from "../utils/user.utils";


export default function useUser() {
  const dispatch = useAppDispatch()
  const user: RootState["user"] = { ...getUserLocalStorage() }

  const login = (user: any) => dispatch(signInAction(user))
  const update = (update: any) => dispatch(updateUserAction(update))
  const logout = () => dispatch(logOutAction())

  return { user, login, update, logout }
}