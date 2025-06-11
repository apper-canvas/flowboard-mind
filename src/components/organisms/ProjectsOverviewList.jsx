import React from 'react';
import { motion } from 'framer-motion';

const ProjectsOverviewList = ({ projects, tasks }) => {
  const getProjectTaskCount = (projectId) => {
    return tasks.filter(task => task.projectId === projectId).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Projects</h2>
      </div>
      <div className="p-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{project.name}</h3>
              <p className="text-xs text-gray-500 truncate">{project.key}</p>
            </div>
            <div className="text-xs text-gray-500">
              {getProjectTaskCount(project.id)} tasks
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsOverviewList;