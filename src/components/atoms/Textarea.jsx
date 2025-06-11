import React from 'react';

const Textarea = ({ value, onChange, placeholder, name, rows = 3, className = '', ...props }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className}`}
      {...props}
    />
  );
};

export default Textarea;