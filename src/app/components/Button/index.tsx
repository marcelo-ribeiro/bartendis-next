"use client";

import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export const Button = ({
  variant,
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    variant?: "primary" | "accent" | "outline" | "clear";
    size?: "lg" | "md" | "sm";
  }) => {
  const baseStyles =
    "flex items-center justify-center py-2 rounded-lg font-semibold transition duration-300 appearance-none";

  const sizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-2 text-sm h-8";
      case "lg":
        return "px-6 text-lg h-12";
      case "md":
      default:
        return "px-4 text-sm h-10";
    }
  };

  const variantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-red-600 text-white hover:bg-red-500";
      case "accent":
        return "bg-green-500 text-white hover:bg-green-600";
      case "outline":
        return "border-2 border-stone-200 text-gray-500 hover:bg-gray-100";
      case "clear":
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles()} ${sizeStyles()}`}
      {...props}
    >
      {props.children}
    </button>
  );
};
