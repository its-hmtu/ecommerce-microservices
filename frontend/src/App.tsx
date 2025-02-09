import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import NotFound from './pages/NotFound'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import routes from "./constants/paths"
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import { useQuery } from '@tanstack/react-query'
import userService from './features/services/user.service'
import useUser from './hooks/useUser'

function App() {
  const { user, update } = useUser()
  const {data} = useQuery({
    queryKey: ["cart"],
    queryFn: () => userService.getUserCart(user?.id),
  })

  useEffect(() => {
    if (data) {
      console.log(data)
      update({
        cart: data?.data.cart.items,
        cartTotal: data?.data.totalItems
      })
    }
  }, [data, update])

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='products/:id' element={<ProductPage />} />
        <Route path='cart' element={<CartPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path={routes.PATHS.LOGIN} element={<LoginPage />} />  
        <Route path={routes.PATHS.REGISTER} element={<RegisterPage />} />
      </Route> 
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
