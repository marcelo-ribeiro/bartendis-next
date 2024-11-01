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

  const fillStyles = () => {
    switch (fill) {
      case "outline":
        return "border border-neutral-300 text-neutral-900";
      case "solid":
      default:
        return "";
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
        return "rounded-md";
    }
  };

  const variantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-red-600 text-white";
      case "accent":
        return "bg-green-500 text-white";
      case "light":
        return "bg-gray-500 text-white";
      case "clear":
      default:
        return "";
    }
  };

  return (
    <button
      className={`${baseStyles} ${shapeStyles()} ${fillStyles()} ${variantStyles()} ${sizeStyles()} ${className}`}
      {...restProps}
    />
  );
};
