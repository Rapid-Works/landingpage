// src/components/ui/input.jsx
import React from 'react';

export const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";