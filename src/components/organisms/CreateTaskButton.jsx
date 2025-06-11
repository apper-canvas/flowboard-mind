import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CreateTaskModal from '@/components/organisms/Modals/CreateTaskModal';

const CreateTaskButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateSuccess = (newTask) => {
    // Optionally trigger a refresh or update state in parent if needed
    // For now, just close the modal
    setShowModal(false);
    console.log("Task created:", newTask); // For debugging
  };

  return (
    <>
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="bg-primary text-white hover:bg-primary/90"
      >
        <ApperIcon name="Plus" size={16} />
        <span className="hidden sm:inline">Create Task</span>
      </Button>

      <AnimatePresence>
        {showModal && (
          <CreateTaskModal
            onClose={() => setShowModal(false)}
            onCreateSuccess={handleCreateSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateTaskButton;