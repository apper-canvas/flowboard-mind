import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ProjectSettingsList = ({ projects }) => {
  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">Existing Projects</h3>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{project.name}</h4>
              <p className="text-xs text-gray-500 truncate">Key: {project.key}</p>
              {project.description && (
                <p className="text-xs text-gray-500 mt-1 truncate">{project.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Settings" size={16} className="text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSettingsList;