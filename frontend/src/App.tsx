import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import SuccessPage from './pages/SuccessPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='cart' element={<CartPage />} />
        <Route path='success' element={<SuccessPage />} />
        <Route path='profile' element={<ProfilePage />} />
      </Route>
      <Route path="auth" element={<AuthLayout />}>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
      </Route>
      <Route path='*' element={<div>404</div>} />
    </Routes>
  )
}

export default App
