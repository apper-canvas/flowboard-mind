import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, type = 'text', name, value, onChange, placeholder, required = false, options, rows, children }) => {
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          >
            {children || options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
          />
        );
      default:
        return (
          <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      {renderField()}
    </div>
  );
};

export default FormField;