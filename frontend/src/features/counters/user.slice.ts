import { createSlice } from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

const initialState = {
  _id: "",
  name: "",
  email: ""
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action) => {
      localStorage.setItem("token", JSON.stringify(action.payload.token))
      return action.payload
    },
    logOut: (state) => {
      localStorage.removeItem("token")
      return initialState
    },
    updateUser: (state, action) => {
      const newData = { ...state, ...action.payload }
      localStorage.setItem("user", JSON.stringify(newData))
      return newData
    }
  }
})

export const {
  signIn: signInAction,
  logOut: logOutAction,
  updateUser: updateUserAction
} = userSlice.actions

export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
