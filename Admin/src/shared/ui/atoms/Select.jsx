import React, { forwardRef } from 'react';

const Select = forwardRef(({ className = '', hasError, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-colors
        ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}
        ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
export default Select;