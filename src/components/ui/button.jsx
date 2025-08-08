import React, { forwardRef } from "react";
import { cn } from "./utils";

const buttonVariants = {
  default: "bg-[#7C3BEC] text-white hover:bg-[#6B32D6]",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  ghost: "text-gray-700 hover:bg-gray-100",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-lg",
};

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? "span" : "button";
  
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button };