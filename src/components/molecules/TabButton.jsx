import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TabButton = ({ id, label, icon, isActive, onClick }) => {
  return (
    <Button
      onClick={() => onClick(id)}
      className={`
        px-4 py-2 text-sm font-medium transition-colors
        ${isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}
      `}
    >
      <ApperIcon name={icon} size={16} />
      <span>{label}</span>
    </Button>
  );
};

export default TabButton;