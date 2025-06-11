import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import ModalBackdrop from '@/components/atoms/ModalBackdrop';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import UserAvatar from '@/components/molecules/UserAvatar';
import userService from '@/services/api/userService';

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
          authorId: 'current-user', // Mock current user
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

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const currentUser = { id: 'current-user', name: 'John Doe' }; // Mock current user for comments

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono text-gray-500">
                {task.id.toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(task.status)}`}>
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
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-primary border border-primary hover:bg-primary/5"
                >
                  Edit
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="text-sm bg-primary text-white hover:bg-primary/90"
                  >
                    Save
                  </Button>
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <Button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <FormField
              label="Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormFieldChange}
              readOnly={!isEditing}
            />

            <FormField
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleFormFieldChange}
              rows={4}
              readOnly={!isEditing}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Status"
                type="select"
                name="status"
                value={formData.status}
                onChange={handleFormFieldChange}
                disabled={!isEditing}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="done">Done</option>
              </FormField>

              <FormField
                label="Priority"
                type="select"
                name="priority"
                value={formData.priority}
                onChange={handleFormFieldChange}
                disabled={!isEditing}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </FormField>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee
                </label>
                {isEditing ? (
                  <FormField
                    type="select"
                    name="assigneeId"
                    value={formData.assigneeId}
                    onChange={handleFormFieldChange}
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </FormField>
                ) : (
                  <div className="flex items-center space-x-2">
                    {assignee ? (
                      <>
                        <UserAvatar user={assignee} size="small" />
                        <span>{assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Comments ({task.comments?.length || 0})
              </h3>
              
              <div className="flex space-x-3 mb-4">
                <UserAvatar user={currentUser} size="medium" />
                <div className="flex-1">
                  <FormField
                    type="textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="text-sm"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-primary text-white text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <UserAvatar user={currentUser} size="medium" /> {/* Mock user for comments */}
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