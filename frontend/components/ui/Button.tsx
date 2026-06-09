"use client";

import { IButtonProps, ButtonVariant, ButtonShape } from "@/types";

export const Button = ({
  children,
  variant = "primary",
  shape = "asymmetric",
  isLoading = false,
  icon: Icon,
  className = "",
  disabled,
  ...props
}: IButtonProps) => {

  const baseStyles = "flex items-center justify-center gap-2 px-5 py-2.5 font-bold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-fit select-none";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary-200 text-white hover:bg-primary-100 focus:ring-primary-200",
    secondary: "bg-secondary-200 text-white hover:bg-secondary-100 focus:ring-secondary-200",
    danger: "bg-alert-200 text-white hover:bg-alert-300 focus:ring-alert-200", 
    warning: "bg-warning-200 text-neutral-1000 hover:bg-warning-300 hover:text-white focus:ring-warning-200",
    info: "bg-info-300 text-white hover:bg-info-200 focus:ring-info-300",
    outline: "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-500",
  };

  const shapes: Record<ButtonShape, string> = {
    asymmetric: "rounded-tl-sm rounded-tr-lg rounded-br-sm rounded-bl-lg",
    standard: "rounded-md",
    rounded: "rounded-full",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${shapes[shape]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        Icon && <Icon className="w-5 h-5 flex-shrink-0" />
      )}

      <span>{isLoading ? "Cargando..." : children}</span>
    </button>
  );
};