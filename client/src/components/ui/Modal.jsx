import React, { useEffect } from "react";

export default function Modal({ open, title, children, footer, onClose, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxW =
    size === "lg"
      ? "max-w-2xl"
      : size === "sm"
        ? "max-w-sm"
        : "max-w-lg";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 cursor-pointer bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxW} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}
      >
        {title && <h3 className="mb-4 text-xl font-semibold text-gray-900">{title}</h3>}
        <div className="text-gray-800">{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
