import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Products from './pages/Products'
import LowStock from './pages/LowStock'
import Sales from './pages/Sales'

function App() {
  return (
    <>
    <div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/products' element={<Products/>}></Route>
        <Route path='/low-stock' element={<LowStock/>}></Route>
        <Route path='/sales' element={<Sales/>}></Route>
      </Routes>
    </div>
    </>
  )
}

export default App
