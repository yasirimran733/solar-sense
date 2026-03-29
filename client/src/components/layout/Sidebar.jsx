import React from "react";
import { NavLink } from "react-router-dom";
import { FaSolarPanel, FaThLarge, FaBoxOpen, FaShoppingCart, FaReceipt, FaExclamationTriangle } from "react-icons/fa";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
      : "text-gray-600 hover:bg-amber-50 hover:text-gray-900"
  }`;

const items = [
  { to: "/dashboard", label: "Dashboard", icon: FaThLarge },
  { to: "/products", label: "Products", icon: FaBoxOpen },
  { to: "/cart", label: "Cart / POS", icon: FaShoppingCart },
  { to: "/sales", label: "Sales", icon: FaReceipt },
  { to: "/low-stock", label: "Low Stock", icon: FaExclamationTriangle },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-100 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-md">
          <FaSolarPanel className="text-xl text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Solar Sense</p>
          <p className="text-xs text-gray-500">Inventory & POS</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === "/dashboard"}>
              <Icon className="text-lg opacity-90" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 p-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Solar Sense Technologies
      </div>
    </aside>
  );
}
