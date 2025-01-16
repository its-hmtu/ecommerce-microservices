import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<h1>Home</h1>} />
        <Route path="about" element={<h1>About</h1>} />
      </Route>

    </Routes>
  )
}

export default App
