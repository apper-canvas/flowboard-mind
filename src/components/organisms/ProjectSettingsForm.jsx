import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import projectService from '@/services/api/projectService';

const ProjectSettingsForm = ({ onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newProject = await projectService.create({
        name: formData.name,
        key: formData.key,
        description: formData.description,
        workflow: ['to-do', 'in-progress', 'testing', 'done'],
        createdAt: new Date().toISOString()
      });

      onCreateSuccess(newProject);
      setFormData({ name: '', key: '', description: '' });
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Project Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter project name"
          required
        />
        <FormField
          label="Project Key"
          type="text"
          name="key"
          value={formData.key}
          onChange={handleInputChange}
          placeholder="e.g., PROJ"
          required
        />
      </div>
      <FormField
        label="Description"
        type="textarea"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Project description (optional)"
        rows={3}
      />
      <Button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary text-white hover:bg-primary/90"
      >
        Create Project
      </Button>
    </form>
  );
};

export default ProjectSettingsForm;