import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loader({ label = "Loading...", fullPage }) {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-3 text-amber-600">
      <FaSpinner className="h-8 w-8 animate-spin" aria-hidden />
      {label && <p className="text-sm font-medium text-gray-600">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">{inner}</div>
    );
  }

  return <div className="flex items-center justify-center py-8">{inner}</div>;
}
