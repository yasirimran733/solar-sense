import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'

function Dashboard() {
  const [totalProducts,setTotalProducts] = useState(0);
  const [totalInvoices,setTotalInvoices] = useState(0);
  const [totalProfit,setTotalProfit] = useState(0);
  const [totalSales,setTotalSales] = useState(0);

  const token = localStorage.getItem("token")

  const dashboardSummary = async ()=>{
    try{
      const response = await axios.get("http://localhost:5000/api/dashboard/summary",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(response.data.success){
        console.log(response.data)
        setTotalProducts(response.data.totalProducts)
        setTotalInvoices(response.data.totalInvoices)
        setTotalProfit(response.data.totalProfit)
        setTotalSales(response.data.totalSales)

      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
      dashboardSummary();
    },[])

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{totalInvoices}-{totalProducts}-{totalProfit}-{totalSales}</p>
    </div>
  )
}

export default Dashboard
