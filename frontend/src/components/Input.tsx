import type { InputHTMLAttributes } from "react";

export function Input({
  label,
  id,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-lg border border-surface bg-background px-3 py-2.5 text-sm text-text shadow-inner outline-none transition placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25 ${className}`}
        {...props}
      />
    </div>
  );
}
