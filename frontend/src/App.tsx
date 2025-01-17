import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import routes from './constants/paths'
import NotFound from './pages/NotFound'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
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
