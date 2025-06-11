import React from 'react';

const Input = ({ value, onChange, placeholder, type = 'text', name, required = false, className = '', ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className}`}
      {...props}
    />
  );
};

export default Input;