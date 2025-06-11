import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';
import userService from '../services/api/userService';

const TaskModal = ({ task, assignee, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId
  });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSave = () => {
    onUpdate(task.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId
    });
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedComments = [
        ...(task.comments || []),
        {
          id: Date.now().toString(),
          text: newComment.trim(),
          authorId: 'current-user',
          createdAt: new Date().toISOString()
        }
      ];
      
      onUpdate(task.id, { comments: updatedComments });
      setNewComment('');
    }
  };

  const getPriorityColor = (priority) => {
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

  const getStatusColor = (status) => {
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

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono text-gray-500">
                {task.id.toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                {(isEditing ? formData.status : task.status).replace('-', ' ')}
              </span>
              <ApperIcon
                name="Flag"
                size={16}
                className={getPriorityColor(isEditing ? formData.priority : task.priority)}
              />
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Edit
                </motion.button>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              ) : (
                <h2 className="text-lg font-medium text-gray-900">{task.title}</h2>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              ) : (
                <p className="text-gray-700">{task.description}</p>
              )}
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="to-do">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="testing">Testing</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                {isEditing ? (
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ApperIcon
                      name="Flag"
                      size={16}
                      className={getPriorityColor(task.priority)}
                    />
                    <span className="capitalize">{task.priority}</span>
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee
                </label>
                {isEditing ? (
                  <select
                    value={formData.assigneeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, assigneeId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    {assignee ? (
                      <>
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {assignee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Comments ({task.comments?.length || 0})
              </h3>
              
              {/* Comment Input */}
              <div className="flex space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  JD
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comment
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      JD
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900 break-words">{comment.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(comment.createdAt), 'MMM dd, yyyy at h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
              <p>Created: {format(new Date(task.createdAt), 'MMM dd, yyyy at h:mm a')}</p>
              <p>Updated: {format(new Date(task.updatedAt), 'MMM dd, yyyy at h:mm a')}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TaskModal;