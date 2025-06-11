import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import projectService from '../services/api/projectService';
import taskService from '../services/api/taskService';
import sprintService from '../services/api/sprintService';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [projectsData, tasksData, sprintsData] = await Promise.all([
          projectService.getAll(),
          taskService.getAll(),
          sprintService.getAll()
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
        setSprints(sprintsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getTaskCountByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getActiveSprints = () => {
    return sprints.filter(sprint => sprint.status === 'active').length;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/board')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Board
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="CheckCircle" size={24} className="text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{getTaskCountByStatus('done')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-warning/10 rounded-lg">
                <ApperIcon name="Clock" size={24} className="text-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{getTaskCountByStatus('in-progress')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-info/10 rounded-lg">
                <ApperIcon name="Timer" size={24} className="text-info" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sprints</p>
                <p className="text-2xl font-semibold text-gray-900">{getActiveSprints()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <ApperIcon name="FolderOpen" size={24} className="text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
            </div>
            <div className="p-6">
              {tasks.slice(0, 5).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-error' :
                      task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <span className="text-sm text-gray-900 truncate">{task.title}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'done' ? 'bg-success/10 text-success' :
                    task.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                    task.status === 'testing' ? 'bg-info/10 text-info' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
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
                    {tasks.filter(task => task.projectId === project.id).length} tasks
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;