// src/components/ui/button.jsx
import React from 'react';

export function Button({ children, className, ...props }) {
    return (
      <button
        className={`px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }