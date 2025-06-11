import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, differenceInDays } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import CreateSprintModal from '../components/CreateSprintModal';
import SprintPlanningModal from '../components/SprintPlanningModal';
import sprintService from '../services/api/sprintService';
import taskService from '../services/api/taskService';

const Sprints = () => {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);

  useEffect(() => {
    loadSprints();
    loadTasks();
  }, []);

  const loadSprints = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sprintService.getAll();
      setSprints(data);
    } catch (err) {
      setError(err.message || 'Failed to load sprints');
      toast.error('Failed to load sprints');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const handleCreateSprint = async (sprintData) => {
    try {
      const newSprint = await sprintService.create({
        ...sprintData,
        status: 'planned',
        taskIds: [],
        createdAt: new Date().toISOString()
      });

      setSprints(prev => [newSprint, ...prev]);
      setShowCreateModal(false);
      toast.success('Sprint created successfully');
    } catch (err) {
      toast.error('Failed to create sprint');
    }
  };

  const handleStartSprint = async (sprintId) => {
    try {
      const updatedSprint = await sprintService.update(sprintId, {
        status: 'active'
      });

      setSprints(prev =>
        prev.map(sprint =>
          sprint.id === sprintId ? updatedSprint : sprint
        )
      );

      toast.success('Sprint started');
    } catch (err) {
      toast.error('Failed to start sprint');
    }
  };

  const handleCompleteSprint = async (sprintId) => {
    try {
      const updatedSprint = await sprintService.update(sprintId, {
        status: 'completed'
      });

      setSprints(prev =>
        prev.map(sprint =>
          sprint.id === sprintId ? updatedSprint : sprint
        )
      );

      toast.success('Sprint completed');
    } catch (err) {
      toast.error('Failed to complete sprint');
    }
  };

  const getSprintTasks = (sprintId) => {
    return tasks.filter(task => task.sprintId === sprintId);
  };

  const getSprintProgress = (sprintId) => {
    const sprintTasks = getSprintTasks(sprintId);
    if (sprintTasks.length === 0) return 0;
    
    const completedTasks = sprintTasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / sprintTasks.length) * 100);
  };

  const getDaysRemaining = (endDate) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return Math.max(0, days);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-white';
      case 'planned':
        return 'bg-info text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load sprints</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadSprints}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </motion.button>
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
          <h1 className="text-2xl font-semibold text-gray-900">Sprints</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Create Sprint</span>
          </motion.button>
        </div>

        {/* Sprints List */}
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Create Sprint
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sprints.map((sprint, index) => {
              const sprintTasks = getSprintTasks(sprint.id);
              const progress = getSprintProgress(sprint.id);
              const daysRemaining = getDaysRemaining(sprint.endDate);

              return (
                <motion.div
                  key={sprint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{sprint.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sprint.status)}`}>
                            {sprint.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" size={16} />
                            <span>{format(new Date(sprint.startDate), 'MMM dd')} - {format(new Date(sprint.endDate), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Clock" size={16} />
                            <span>{daysRemaining} days remaining</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="CheckSquare" size={16} />
                            <span>{sprintTasks.length} tasks</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {sprint.status === 'planned' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedSprint(sprint)}
                              className="px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                            >
                              Plan Sprint
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStartSprint(sprint.id)}
                              className="px-3 py-1 text-sm bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                            >
                              Start Sprint
                            </motion.button>
                          </>
                        )}
                        {sprint.status === 'active' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCompleteSprint(sprint.id)}
                            className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            Complete Sprint
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {sprintTasks.length > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{progress}% complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-success h-2 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    )}

                    {/* Task Summary */}
                    {sprintTasks.length > 0 && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>{sprintTasks.filter(t => t.status === 'to-do').length} To Do</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-warning rounded-full"></div>
                          <span>{sprintTasks.filter(t => t.status === 'in-progress').length} In Progress</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-info rounded-full"></div>
                          <span>{sprintTasks.filter(t => t.status === 'testing').length} Testing</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span>{sprintTasks.filter(t => t.status === 'done').length} Done</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Sprint Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateSprintModal
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateSprint}
            />
          )}
        </AnimatePresence>

        {/* Sprint Planning Modal */}
        <AnimatePresence>
          {selectedSprint && (
            <SprintPlanningModal
              sprint={selectedSprint}
              tasks={tasks}
              onClose={() => setSelectedSprint(null)}
              onUpdate={(updatedSprint) => {
                setSprints(prev =>
                  prev.map(sprint =>
                    sprint.id === updatedSprint.id ? updatedSprint : sprint
                  )
                );
                setSelectedSprint(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Sprints;