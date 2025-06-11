import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ModalBackdrop from '@/components/atoms/ModalBackdrop';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import taskService from '@/services/api/taskService';
import userService from '@/services/api/userService';
import projectService from '@/services/api/projectService';

const CreateTaskModal = ({ onClose, onCreateSuccess }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigneeId: '',
    projectId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, projectsData] = await Promise.all([
        userService.getAll(),
        projectService.getAll()
      ]);
      setUsers(usersData);
      setProjects(projectsData);
      
      if (projectsData.length > 0) {
        setFormData(prev => ({ ...prev, projectId: projectsData[0].id }));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }

    setLoading(true);
    try {
      const newTask = await taskService.create({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: 'to-do',
        sprintId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      });

      onCreateSuccess && onCreateSuccess(newTask);
      toast.success('Task created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Create New Task</h2>
            <Button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              required
            />

            <FormField
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              rows={3}
            />

            <FormField
              label="Project"
              type="select"
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.key})
                </option>
              ))}
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Priority"
                type="select"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </FormField>

              <FormField
                label="Assignee"
                type="select"
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleInputChange}
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </FormField>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Task'
                )}
              </Button>
              
              <Button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default CreateTaskModal;