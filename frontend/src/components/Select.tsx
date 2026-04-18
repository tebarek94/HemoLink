import type { SelectHTMLAttributes } from "react";

export function Select({
  label,
  id,
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <select
        id={id}
        className={`rounded-lg border border-surface bg-background px-3 py-2.5 text-sm text-text shadow-inner outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/25 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
