import React from 'react';
import { motion } from 'framer-motion';

const ModalBackdrop = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClick}
    />
  );
};

export default ModalBackdrop;