import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import DashboardStats from '@/components/organisms/DashboardStats';
import RecentActivitySection from '@/components/organisms/RecentActivitySection';
import projectService from '@/services/api/projectService';
import taskService from '@/services/api/taskService';
import sprintService from '@/services/api/sprintService';

const HomePage = () => {
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/board')}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Go to Board
          </Button>
        </div>

        <DashboardStats
          totalProjects={projects.length}
          totalTasks={tasks.length}
          inProgressTasks={getTaskCountByStatus('in-progress')}
          completedTasks={getTaskCountByStatus('done')}
          activeSprints={getActiveSprints()}
        />

        <RecentActivitySection tasks={tasks} projects={projects} />
      </motion.div>
    </div>
  );
};

export default HomePage;