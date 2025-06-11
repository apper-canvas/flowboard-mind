import React from 'react';
import { motion } from 'framer-motion';

const WorkflowConfigSection = () => {
  const workflowStatuses = [
    { id: 'to-do', label: 'To Do', color: 'bg-gray-400', description: 'Tasks that are ready to be worked on' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-warning', description: 'Tasks currently being worked on' },
    { id: 'testing', label: 'Testing', color: 'bg-info', description: 'Tasks under review or testing' },
    { id: 'done', label: 'Done', color: 'bg-success', description: 'Completed tasks' }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-2">Workflow Configuration</h2>
      <p className="text-sm text-gray-600">Customize your project workflow states</p>
      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowStatuses.map((status, index) => (
            <motion.div
              key={status.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                <h4 className="text-sm font-medium text-gray-900 capitalize">
                  {status.label}
                </h4>
              </div>
              <p className="text-xs text-gray-500">{status.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowConfigSection;