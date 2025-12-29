import React from "react";
import clsx from "clsx";

type Variant = "light" | "solid";
type Color =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: Color;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
}

const colorClasses: Record<Variant, Record<Color, string>> = {
  light: {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-sky-100 text-sky-800",
    light: "bg-gray-100 text-gray-800",
    dark: "bg-gray-800 text-white",
  },
  solid: {
    primary: "bg-blue-600 text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-sky-600 text-white",
    light: "bg-gray-200 text-gray-800",
    dark: "bg-gray-900 text-white",
  },
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "light",
  color = "primary",
  startIcon,
  endIcon,
  className,
}) => {
  const variantColor =
    colorClasses[variant]?.[color] || colorClasses.light.primary;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 select-none",
        variantColor,
        className
      )}
    >
      {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
    </span>
  );
};

export default Badge;
