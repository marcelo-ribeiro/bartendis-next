import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export const Button = ({
  primary = false,
  small = false,
  outline = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    primary?: boolean;
    small?: boolean;
    outline?: boolean;
  }) => {
  return (
    <button
      {...props}
      className={`flex items-center justify-center py-2 appearance-none rounded-lg font-semibold ${
        primary && "bg-red-600 text-white"
      } ${outline ? "border border-stone-300" : ""} ${
        small ? "text-xs h-8 px-2" : "text-sm h-12 px-4"
      }`}
    >
      {props.children}
    </button>
  );
};
