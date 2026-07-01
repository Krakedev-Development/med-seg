import React, { forwardRef } from 'react';

const Input = forwardRef(({ className = '', hasError, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
        ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}
        ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
export default Input;