import React from 'react';
import { motion } from 'framer-motion';

const RecentTasksList = ({ tasks }) => {
  const getPriorityDotColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-gray-400';
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'done': return 'bg-success/10 text-success';
      case 'in-progress': return 'bg-warning/10 text-warning';
      case 'testing': return 'bg-info/10 text-info';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
      </div>
      <div className="p-6">
        {tasks.slice(0, 5).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`w-2 h-2 rounded-full ${getPriorityDotColor(task.priority)}`} />
              <span className="text-sm text-gray-900 truncate">{task.title}</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasksList;