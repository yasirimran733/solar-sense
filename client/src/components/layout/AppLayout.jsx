import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const titles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/cart": "Cart / Checkout",
  "/sales": "Sales & Invoices",
  "/low-stock": "Low Stock",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "Solar Sense";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-purple-50/40">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar title={title} />
        <main className="flex-1 overflow-auto px-4 py-6 pb-24 md:px-8 md:pb-6">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
