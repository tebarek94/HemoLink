import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-[#a30d26] focus-visible:ring-primary/40 shadow-sm",
  secondary:
    "bg-secondary text-white hover:bg-[#004a94] focus-visible:ring-secondary/40 shadow-sm",
  accent: "bg-accent text-white hover:bg-[#008a45] focus-visible:ring-accent/40 shadow-sm",
  ghost:
    "bg-transparent text-text border border-surface hover:bg-surface focus-visible:ring-text/20",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
