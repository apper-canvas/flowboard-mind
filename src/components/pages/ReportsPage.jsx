import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import DashboardStats from '@/components/organisms/DashboardStats';
import ReportsChartsSection from '@/components/organisms/ReportsChartsSection';
import taskService from '@/services/api/taskService';
import sprintService from '@/services/api/sprintService';

const ReportsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, sprintsData] = await Promise.all([
        taskService.getAll(),
        sprintService.getAll()
      ]);
      setTasks(tasksData);
      setSprints(sprintsData);
    } catch (error) {
      console.error('Failed to load reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusData = () => {
    const statusCounts = {
      'To Do': tasks.filter(t => t.status === 'to-do').length,
      'In Progress': tasks.filter(t => t.status === 'in-progress').length,
      'Testing': tasks.filter(t => t.status === 'testing').length,
      'Done': tasks.filter(t => t.status === 'done').length
    };

    return {
      series: Object.values(statusCounts),
      options: {
        chart: { type: 'donut' },
        labels: Object.keys(statusCounts),
        colors: ['#94a3b8', '#FF991F', '#0065FF', '#00875A'],
        legend: { position: 'bottom' },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }]
      }
    };
  };

  const getPriorityData = () => {
    const priorityCounts = {
      'High': tasks.filter(t => t.priority === 'high').length,
      'Medium': tasks.filter(t => t.priority === 'medium').length,
      'Low': tasks.filter(t => t.priority === 'low').length
    };

    return {
      series: [{
        data: Object.values(priorityCounts)
      }],
      options: {
        chart: { type: 'bar', horizontal: true },
        xaxis: { categories: Object.keys(priorityCounts) },
        colors: ['#DE350B', '#FF991F', '#00875A'],
        plotOptions: {
          bar: { borderRadius: 4 }
        }
      }
    };
  };

  const getSprintProgressData = () => {
    const sprintData = sprints.map(sprint => {
      const sprintTasks = tasks.filter(task => task.sprintId === sprint.id);
      const completedTasks = sprintTasks.filter(task => task.status === 'done').length;
      const progress = sprintTasks.length > 0 ? Math.round((completedTasks / sprintTasks.length) * 100) : 0;
      
      return {
        name: sprint.name,
        progress,
        totalTasks: sprintTasks.length,
        completedTasks
      };
    });

    return {
      series: [{
        name: 'Progress',
        data: sprintData.map(s => s.progress)
      }],
      options: {
        chart: { type: 'bar' },
        xaxis: { categories: sprintData.map(s => s.name) },
        colors: ['#0052CC'],
        plotOptions: {
          bar: { borderRadius: 4 }
        },
        yaxis: {
          min: 0,
          max: 100,
          labels: {
            formatter: (val) => `${val}%`
          }
        }
      }
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const taskStatusData = getTaskStatusData();
  const priorityData = getPriorityData();
  const sprintProgressData = getSprintProgressData();

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        </div>

        <DashboardStats
          totalTasks={tasks.length}
          completedTasks={tasks.filter(t => t.status === 'done').length}
          inProgressTasks={tasks.filter(t => t.status === 'in-progress').length}
          activeSprints={sprints.filter(s => s.status === 'active').length}
          // Note: totalProjects is not directly available here, so passing 0 or removing if not needed.
          // For now, setting to 0 or omitting from DashboardStats based on actual usage.
          // Assuming DashboardStats is flexible with props, or a separate component for reports.
          // Re-checking the original, these are distinct stat cards. Let's make a generic one.
          // Corrected: The StatCard molecule can be reused, and DashboardStats is an organism combining them.
          // But here on reports page, there are different stats. Let's keep it clean.
          // The StatCard molecule is used directly here to match existing logic.
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="CheckSquare" size={24} className="text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-success/10 rounded-lg">
                <ApperIcon name="CheckCircle" size={24} className="text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.status === 'done').length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {sprints.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>


        <ReportsChartsSection
          taskStatusData={taskStatusData}
          priorityData={priorityData}
          sprintProgressData={sprintProgressData}
          sprints={sprints}
        />
      </motion.div>
    </div>
  );
};

export default ReportsPage;