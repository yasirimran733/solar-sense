import React from "react";
import { NavLink } from "react-router-dom";
import { FaThLarge, FaBoxOpen, FaShoppingCart, FaReceipt, FaExclamationTriangle } from "react-icons/fa";

const items = [
  { to: "/dashboard", label: "Home", icon: FaThLarge },
  { to: "/products", label: "Products", icon: FaBoxOpen },
  { to: "/cart", label: "Cart", icon: FaShoppingCart },
  { to: "/sales", label: "Sales", icon: FaReceipt },
  { to: "/low-stock", label: "Stock", icon: FaExclamationTriangle },
];

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Primary"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold ${
                isActive ? "text-amber-600" : "text-gray-500"
              }`
            }
          >
            <Icon className="text-lg" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
