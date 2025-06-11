import React from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SprintInfoCard = ({ sprint, tasks, onStart, onComplete, onPlan, index }) => {
  const getSprintTasks = (sprintId) => {
    return tasks.filter(task => task.sprintId === sprintId);
  };

  const getSprintProgress = (sprintId) => {
    const sprintTasks = getSprintTasks(sprintId);
    if (sprintTasks.length === 0) return 0;
    
    const completedTasks = sprintTasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / sprintTasks.length) * 100);
  };

  const getDaysRemaining = (endDate) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return Math.max(0, days);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-white';
      case 'planned':
        return 'bg-info text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const sprintTasks = getSprintTasks(sprint.id);
  const progress = getSprintProgress(sprint.id);
  const daysRemaining = getDaysRemaining(sprint.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900 truncate">{sprint.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sprint.status)}`}>
                {sprint.status}
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={16} />
                <span>{format(new Date(sprint.startDate), 'MMM dd')} - {format(new Date(sprint.endDate), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" size={16} />
                <span>{daysRemaining} days remaining</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="CheckSquare" size={16} />
                <span>{sprintTasks.length} tasks</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {sprint.status === 'planned' && (
              <>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPlan(sprint)}
                  className="text-sm text-primary border border-primary hover:bg-primary/5"
                >
                  Plan Sprint
                </Button>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStart(sprint.id)}
                  className="text-sm bg-success text-white hover:bg-success/90"
                >
                  Start Sprint
                </Button>
              </>
            )}
            {sprint.status === 'active' && (
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete(sprint.id)}
                className="text-sm bg-primary text-white hover:bg-primary/90"
              >
                Complete Sprint
              </Button>
            )}
          </div>
        </div>

        {sprintTasks.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-success h-2 rounded-full"
              ></motion.div>
            </div>
          </div>
        )}

        {sprintTasks.length > 0 && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>{sprintTasks.filter(t => t.status === 'to-do').length} To Do</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>{sprintTasks.filter(t => t.status === 'in-progress').length} In Progress</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span>{sprintTasks.filter(t => t.status === 'testing').length} Testing</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>{sprintTasks.filter(t => t.status === 'done').length} Done</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SprintInfoCard;