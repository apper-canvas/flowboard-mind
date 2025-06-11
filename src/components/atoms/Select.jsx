import React from 'react';

const Select = ({ value, onChange, children, name, required = false, className = '', ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;