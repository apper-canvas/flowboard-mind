import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TabButton from '@/components/molecules/TabButton';
import ProjectSettingsForm from '@/components/organisms/ProjectSettingsForm';
import ProjectSettingsList from '@/components/organisms/ProjectSettingsList';
import TeamSettingsList from '@/components/organisms/TeamSettingsList';
import WorkflowConfigSection from '@/components/organisms/WorkflowConfigSection';
import projectService from '@/services/api/projectService';
import userService from '@/services/api/userService';

const SettingsPage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: 'FolderOpen' },
    { id: 'team', label: 'Team', icon: 'Users' },
    { id: 'workflow', label: 'Workflow', icon: 'GitBranch' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsData, usersData] = await Promise.all([
        projectService.getAll(),
        userService.getAll()
      ]);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
        
        <div className="flex space-x-1 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Project Management</h2>
                <p className="text-sm text-gray-600">Create and manage your projects</p>
              </div>
              <ProjectSettingsForm onCreateSuccess={handleProjectCreated} />
              <ProjectSettingsList projects={projects} />
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6"
            >
              <TeamSettingsList users={users} />
            </motion.div>
          )}

          {activeTab === 'workflow' && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6"
            >
              <WorkflowConfigSection />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;