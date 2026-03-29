import React from 'react'
import axios from 'axios';
import { useState,useEffect } from 'react';

function LowStock() {
  const [products,setProducts] = useState([]);
  const token = localStorage.getItem("token")
  
  const getLowStockProducts = async ()=>{
    try{
        const response = await axios.get("http://localhost:5000/api/dashboard/stock",{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        if(response.data.success){
          setProducts(response.data.products)
          console.log(typeof(products))
        }
      }catch(error){
        console.log(error)
      }
    }
  
    useEffect(()=>{
        getLowStockProducts();
      },[])
  
  return (
    <div>
      <h1>Low Stock Products</h1>
      {products ? products.map((product)=>{
        return (
        <div key={product._id}>
         <h2> {product.name}</h2>
         <p>{product.sale_price}</p>
        </div>
      )
      }) : <p>No Products Found</p>
      }
    
    </div>
  )
}

export default LowStock
