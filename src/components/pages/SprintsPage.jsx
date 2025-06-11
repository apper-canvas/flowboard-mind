import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SprintListSection from '@/components/organisms/SprintListSection';
import CreateSprintModal from '@/components/organisms/Modals/CreateSprintModal';
import SprintPlanningModal from '@/components/organisms/Modals/SprintPlanningModal';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import sprintService from '@/services/api/sprintService';
import taskService from '@/services/api/taskService';

const SprintsPage = () => {
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

  const handleCreateSprintSuccess = (newSprint) => {
    setSprints(prev => [newSprint, ...prev]);
    setShowCreateModal(false);
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

  const handleSprintUpdate = (updatedSprint) => {
    setSprints(prev =>
      prev.map(sprint =>
        sprint.id === updatedSprint.id ? updatedSprint : sprint
      )
    );
    setSelectedSprint(null);
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
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadSprints}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <SprintListSection
        sprints={sprints}
        tasks={tasks}
        onStartSprint={handleStartSprint}
        onCompleteSprint={handleCompleteSprint}
        onPlanSprint={setSelectedSprint}
        onCreateSprint={() => setShowCreateModal(true)}
      />

      <AnimatePresence>
        {showCreateModal && (
          <CreateSprintModal
            onClose={() => setShowCreateModal(false)}
            onCreateSuccess={handleCreateSprintSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSprint && (
          <SprintPlanningModal
            sprint={selectedSprint}
            tasks={tasks} // Pass all tasks, modal filters by sprintId
            onClose={() => setSelectedSprint(null)}
            onUpdate={handleSprintUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SprintsPage;