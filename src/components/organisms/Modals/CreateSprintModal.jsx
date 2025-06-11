import React, { useState } from 'react';
import { format, addWeeks } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ModalBackdrop from '@/components/atoms/ModalBackdrop';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import sprintService from '@/services/api/sprintService';

const CreateSprintModal = ({ onClose, onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addWeeks(new Date(), 2), 'yyyy-MM-dd')
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Sprint name is required');
      return;
    }

    setLoading(true);
    try {
      const newSprint = await sprintService.create({
        ...formData,
        status: 'planned',
        taskIds: [],
        createdAt: new Date().toISOString()
      });

      onCreateSuccess && onCreateSuccess(newSprint);
      toast.success('Sprint created successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to create sprint');
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
            <h2 className="text-lg font-medium text-gray-900">Create New Sprint</h2>
            <Button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Sprint Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Sprint 1, Feature Development Sprint"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
              
              <FormField
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                required
              />
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
                  'Create Sprint'
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

export default CreateSprintModal;