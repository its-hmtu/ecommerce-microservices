import {configureStore, combineReducers} from "@reduxjs/toolkit"
import userReducer from "../features/counters/user.slice"
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: 'root',
  storage
}

const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer)
})

const store = configureStore({
  reducer: rootReducer
})

export default store
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch