import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';
import CreateTaskModal from './CreateTaskModal';

const CreateTaskButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
      >
        <ApperIcon name="Plus" size={16} />
        <span className="hidden sm:inline">Create Task</span>
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <CreateTaskModal
            onClose={() => setShowModal(false)}
            onCreate={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateTaskButton;