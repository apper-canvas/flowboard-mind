import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ iconName, iconColorClass, label, value }) => {
  return (
    <motion.div
      whileHover={{ translateY: -2 }}
      className="bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${iconColorClass}/10`}>
          <ApperIcon name={iconName} size={24} className={iconColorClass} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;