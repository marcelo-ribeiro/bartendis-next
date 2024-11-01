"use client";

import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export const Button = ({
  variant = "clear",
  size = "medium",
  fill = "solid",
  shape = "round",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    variant?: "primary" | "accent" | "light" | "clear";
    size?: "large" | "medium" | "small";
    fill?: "solid" | "outline";
    shape?: "square" | "round" | "circle";
  }) => {
  const { className, ...restProps } = props;
  const baseStyles =
    "flex items-center justify-center py-2 font-semibold transition duration-300 appearance-none";

  const sizeStyles = () => {
    switch (size) {
      case "small":
        return "px-2 text-sm h-8";
      case "large":
        return "px-6 text-lg h-12";
      case "medium":
      default:
        return "px-4 text-sm h-10";
    }
  };

  const shapeStyles = () => {
    switch (shape) {
      case "circle":
        return "rounded-full";
      case "round":
        return "rounded-lg";
      case "square":
      default:
        return "";
    }
  };

  const variantStyles = () => {
    switch (variant) {
      case "primary":
        return fill === "outline"
          ? "border border-red-600 text-red-600"
          : "bg-red-600 text-white";
      case "accent":
        return fill === "outline"
          ? "border border-yellow-500 text-yellow-500"
          : "bg-yellow-500";
      case "light":
        return fill === "outline"
          ? "border border-neutral-400 text-neutral-600"
          : "bg-neutral-100 text-neutral-600";
      case "clear":
      default:
        return fill === "outline"
          ? "border border-neutral-400 text-neutral-900"
          : "";
    }
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles()} ${shapeStyles()} ${sizeStyles()} ${className}`}
      {...restProps}
    />
  );
};
