import React from 'react';
import Label from '../atoms/Label';

export default function FormField({ label, error, required, children, className = '' }) {
  const clonedChild = React.isValidElement(children) 
    ? React.cloneElement(children, { hasError: !!error }) 
    : children;

  return (
    <div className={`${className}`}>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        {clonedChild}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}