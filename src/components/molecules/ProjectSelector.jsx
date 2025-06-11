import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import projectService from '@/services/api/projectService';

const ProjectSelector = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      >
        <ApperIcon name="FolderOpen" size={16} />
        <span className="max-w-32 truncate">
          {selectedProject ? selectedProject.name : 'Select Project'}
        </span>
        <ApperIcon name="ChevronDown" size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-64 overflow-y-auto"
          >
            <div className="p-2">
              {projects.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No projects available
                </div>
              ) : (
                projects.map((project) => (
                  <motion.button
                    key={project.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => handleProjectSelect(project)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProject?.id === project.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {project.key}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{project.name}</p>
                        {project.description && (
                          <p className="text-xs text-gray-500 truncate">{project.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectSelector;