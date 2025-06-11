import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';
import FilterBar from '@/components/molecules/FilterBar';
import TaskModal from '@/components/organisms/Modals/TaskModal';
import Button from '@/components/atoms/Button';
import taskService from '@/services/api/taskService';
import userService from '@/services/api/userService';

const BacklogPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    status: '',
    sprint: ''
  });

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (!filters.assignee || task.assigneeId === filters.assignee) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.status || task.status === filters.status) &&
      (!filters.sprint || task.sprintId === filters.sprint)
    );
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const getPriorityStats = () => {
    const stats = { high: 0, medium: 0, low: 0 };
    filteredTasks.forEach(task => {
      stats[task.priority]++;
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load backlog</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadTasks}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const priorityStats = getPriorityStats();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Backlog</h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredTasks.length} tasks • {priorityStats.high} high priority • {priorityStats.medium} medium • {priorityStats.low} low
            </p>
          </div>
        </div>

        <FilterBar filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="flex-1 p-6 pt-0 overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Package" className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks in backlog</h3>
            <p className="mt-2 text-gray-500">Create your first task to get started</p>
          </motion.div>
        ) : (
          <div className="space-y-3 max-w-full">
            <AnimatePresence mode="popLayout">
              {sortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full"
                >
                  <TaskCard
                    task={task}
                    assignee={getUserById(task.assigneeId)}
                    onClick={() => setSelectedTask(task)}
                    layout="list"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            assignee={getUserById(selectedTask.assigneeId)}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BacklogPage;