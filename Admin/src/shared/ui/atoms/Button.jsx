import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "inline-flex justify-center items-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary focus:ring-primary",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}