import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Products from './pages/Products'
import LowStock from './pages/LowStock'
import Sales from './pages/Sales'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
    <div>
      <Routes>
        <Route path='/' element={ <ProtectedRoute> <Home/> </ProtectedRoute> }></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
        <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}></Route>
        <Route path='/products' element={<ProtectedRoute><Products/></ProtectedRoute>}></Route>
        <Route path='/low-stock' element={<ProtectedRoute><LowStock/></ProtectedRoute>}></Route>
        <Route path='/sales' element={<ProtectedRoute><Sales/></ProtectedRoute>}></Route>
      </Routes>
    </div>
    </>
  )
}

export default App
