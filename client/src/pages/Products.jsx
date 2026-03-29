import React, { useEffect, useState } from 'react'
import axios from 'axios'
function Products() {
  const [products,setProducts] = useState([]);
  const token = localStorage.getItem("token")

  const getProducts = async ()=>{
    try{
      const response = await axios.get("http://localhost:5000/api/products",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(response.data.success){
        console.log(response.data.products)
        setProducts(response.data.products)
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
      getProducts();
    },[])

  return (
    <div>
      <h1>Products</h1>
      {products.map((product)=>{
        return (
        <div key={product._id}>
         <h2> {product.name}</h2>
         <p>{product.sale_price}</p>
        </div>
      )
      })}
    </div>
  )
}

export default Products
