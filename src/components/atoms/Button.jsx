import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', type = 'button', disabled = false, whileHover, whileTap, ...props }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${className}`}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;