import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FilterBar from '@/components/molecules/FilterBar';
import KanbanColumn from '@/components/organisms/KanbanColumn';
import TaskModal from '@/components/organisms/Modals/TaskModal';
import Button from '@/components/atoms/Button';
import taskService from '@/services/api/taskService';
import userService from '@/services/api/userService';

const BoardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    status: '',
    sprint: ''
  });

  const columns = [
    { id: 'to-do', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-warning/10' },
    { id: 'testing', title: 'Testing', color: 'bg-info/10' },
    { id: 'done', title: 'Done', color: 'bg-success/10' }
  ];

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

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTask = await taskService.update(draggedTask.id, {
        ...draggedTask,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task status');
    }

    setDraggedTask(null);
  };

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-gray-50 p-4 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load board</h3>
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-0">
        <FilterBar filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex space-x-6 min-w-max h-full">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onTaskClick={setSelectedTask}
              getAssigneeById={getUserById}
            />
          ))}
        </div>
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

export default BoardPage;