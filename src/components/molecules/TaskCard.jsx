import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import UserAvatar from '@/components/molecules/UserAvatar';

const TaskCard = ({ task, assignee, onClick, layout = 'card', compact = false }) => {
  const getPriorityBorderColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error';
      case 'medium':
        return 'border-l-warning';
      case 'low':
        return 'border-l-success';
      default:
        return 'border-l-gray-300';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'done':
        return 'bg-success/10 text-success';
      case 'in-progress':
        return 'bg-warning/10 text-warning';
      case 'testing':
        return 'bg-info/10 text-info';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (layout === 'list') {
    return (
      <motion.div
        whileHover={{ translateY: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        onClick={onClick}
        className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-pointer transition-all max-w-full ${getPriorityBorderColor(task.priority)}`}
      >
        <div className="flex items-start justify-between space-x-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono text-gray-500">
                {task.id.toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1 truncate">{task.title}</h4>
            <p className="text-sm text-gray-600 truncate">{task.description}</p>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <ApperIcon
              name="Flag"
              size={16}
              className={getPriorityTextColor(task.priority)}
            />
            {assignee && <UserAvatar user={assignee} size="medium" />}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ translateY: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all overflow-hidden relative ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      {/* Priority indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getPriorityTextColor(task.priority).replace('text-', 'bg-')}`} />
      
      <div className="relative pl-3">
        {/* Task ID and Status */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-500">
            {task.id.toUpperCase()}
          </span>
          <ApperIcon
            name="Flag"
            size={12}
            className={getPriorityTextColor(task.priority)}
          />
        </div>

        {/* Title */}
        <h4 className={`font-medium text-gray-900 mb-2 ${compact ? 'text-sm' : ''} truncate`}>
          {task.title}
        </h4>

        {/* Description */}
        {!compact && task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="MessageCircle" size={12} />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>
          
          {assignee && <UserAvatar user={assignee} size={compact ? 'small' : 'medium'} />}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;