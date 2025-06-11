import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import projectService from '../services/api/projectService';
import userService from '../services/api/userService';

const Settings = () => {
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const newProject = await projectService.create({
        name: formData.get('name'),
        key: formData.get('key'),
        description: formData.get('description'),
        workflow: ['to-do', 'in-progress', 'testing', 'done'],
        createdAt: new Date().toISOString()
      });

      setProjects(prev => [newProject, ...prev]);
      e.target.reset();
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
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
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
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

              {/* Create Project Form */}
              <form onSubmit={handleCreateProject} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Key
                    </label>
                    <input
                      type="text"
                      name="key"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="e.g., PROJ"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Project description (optional)"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Project
                </motion.button>
              </form>

              {/* Projects List */}
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
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Team Management</h2>
                <p className="text-sm text-gray-600">Manage team members and permissions</p>
              </div>

              <div className="space-y-4">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{user.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'workflow' && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6"
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Workflow Configuration</h2>
                <p className="text-sm text-gray-600">Customize your project workflow states</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['to-do', 'in-progress', 'testing', 'done'].map((status, index) => (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'to-do' ? 'bg-gray-400' :
                          status === 'in-progress' ? 'bg-warning' :
                          status === 'testing' ? 'bg-info' : 'bg-success'
                        }`}></div>
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {status.replace('-', ' ')}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500">
                        {status === 'to-do' && 'Tasks that are ready to be worked on'}
                        {status === 'in-progress' && 'Tasks currently being worked on'}
                        {status === 'testing' && 'Tasks under review or testing'}
                        {status === 'done' && 'Completed tasks'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;