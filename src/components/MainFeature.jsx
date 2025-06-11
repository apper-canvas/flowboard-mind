import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import taskService from '../services/api/taskService';
import userService from '../services/api/userService';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

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
    try {
      const data = await taskService.getAll();
      setTasks(data.slice(0, 8)); // Show first 8 tasks
    } catch (err) {
      console.error('Failed to load tasks:', err);
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

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        status: 'to-do',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      });

      setTasks(prev => [newTask, ...prev.slice(0, 7)]);
      setShowCreateModal(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
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

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Project Board</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag and drop tasks between columns to update their status
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Create Task</span>
        </motion.button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`p-4 rounded-t-lg border-b border-gray-200 ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{column.title}</h3>
                  <span className="px-2 py-1 bg-white text-sm text-gray-600 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-4 space-y-3 min-h-40">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Package" size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No tasks</p>
                  </div>
                ) : (
                  columnTasks.slice(0, 2).map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="cursor-move"
                    >
                      <TaskCard
                        task={task}
                        assignee={getUserById(task.assigneeId)}
                        compact
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
          users={users}
        />
      )}
    </div>
  );
};

export default MainFeature;