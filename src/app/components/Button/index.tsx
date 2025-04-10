import { ComponentProps, PropsWithChildren } from "react";

export type ButtonProps = {
  variant?: "primary" | "accent" | "light" | "clear";
  size?: "large" | "medium" | "small";
  fill?: "solid" | "outline";
  shape?: "square" | "round" | "circle";
  expand?: "block";
};

export const Button = ({
  variant = "clear",
  size = "medium",
  fill = "solid",
  shape = "round",
  expand,
  className,
  ...props
}: ButtonProps & ComponentProps<"button"> & PropsWithChildren) => {
  const baseStyles =
    "flex items-center justify-center font-semibold leading-none transition duration-300 appearance-none";

  const sizeStyles = () => {
    switch (size) {
      case "small":
        return "min-h-8 px-4 py-2 text-sm";
      case "medium":
      default:
        return "min-h-10 px-4 py-2 text-sm";
      case "large":
        return "min-h-12 px-6 py-2 text-lg";
    }
  };

  const expandStyles = () => {
    switch (expand) {
      case "block":
        return "w-full";
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
      className={`${baseStyles} ${variantStyles()} ${shapeStyles()} ${sizeStyles()} ${expandStyles()} ${className}`}
      {...props}
    />
  );
};
