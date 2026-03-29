import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white/90 px-4 backdrop-blur md:px-6">
      <h1 className="text-lg font-semibold text-gray-900 md:text-xl">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-sm text-gray-700 sm:flex">
          <FaUser className="text-amber-600" />
          <span className="font-medium">{user?.username ?? "User"}</span>
        </div>
        <Button type="button" variant="secondary" className="px-3 py-1.5 text-sm" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </Button>
      </div>
    </header>
  );
}
