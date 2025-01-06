
// src/components/ui/textarea.jsx
import React from 'react';

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  );
}
