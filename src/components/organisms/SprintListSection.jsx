import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SprintInfoCard from '@/components/molecules/SprintInfoCard';
import Button from '@/components/atoms/Button';

const SprintListSection = ({ sprints, tasks, onStartSprint, onCompleteSprint, onPlanSprint, onCreateSprint }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sprints</h1>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateSprint}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Create Sprint</span>
        </Button>
      </div>

      {sprints.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Timer" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No sprints yet</h3>
          <p className="mt-2 text-gray-500">Create your first sprint to start planning work</p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateSprint}
            className="mt-4 bg-primary text-white"
          >
            Create Sprint
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sprints.map((sprint, index) => (
            <SprintInfoCard
              key={sprint.id}
              sprint={sprint}
              tasks={tasks}
              onStart={onStartSprint}
              onComplete={onCompleteSprint}
              onPlan={onPlanSprint}
              index={index}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SprintListSection;