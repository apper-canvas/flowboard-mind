import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import TaskCard from './TaskCard';
import sprintService from '../services/api/sprintService';
import taskService from '../services/api/taskService';

const SprintPlanningModal = ({ sprint, tasks, onClose, onUpdate }) => {
  const [sprintTasks, setSprintTasks] = useState(
    tasks.filter(task => task.sprintId === sprint.id)
  );
  const [backlogTasks, setBacklogTasks] = useState(
    tasks.filter(task => !task.sprintId)
  );

  const handleAddToSprint = async (task) => {
    try {
      // Update task to assign it to sprint
      const updatedTask = await taskService.update(task.id, {
        ...task,
        sprintId: sprint.id,
        updatedAt: new Date().toISOString()
      });

      // Move task from backlog to sprint
      setBacklogTasks(prev => prev.filter(t => t.id !== task.id));
      setSprintTasks(prev => [...prev, updatedTask]);

      toast.success('Task added to sprint');
    } catch (error) {
      toast.error('Failed to add task to sprint');
    }
  };

  const handleRemoveFromSprint = async (task) => {
    try {
      // Update task to remove it from sprint
      const updatedTask = await taskService.update(task.id, {
        ...task,
        sprintId: null,
        updatedAt: new Date().toISOString()
      });

      // Move task from sprint to backlog
      setSprintTasks(prev => prev.filter(t => t.id !== task.id));
      setBacklogTasks(prev => [...prev, updatedTask]);

      toast.success('Task removed from sprint');
    } catch (error) {
      toast.error('Failed to remove task from sprint');
    }
  };

  const handleSave = async () => {
    try {
      // Update sprint with new task IDs
      const updatedSprint = await sprintService.update(sprint.id, {
        ...sprint,
        taskIds: sprintTasks.map(task => task.id)
      });

      onUpdate(updatedSprint);
      toast.success('Sprint planning saved');
    } catch (error) {
      toast.error('Failed to save sprint planning');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Sprint Planning</h2>
              <p className="text-sm text-gray-600 mt-1">{sprint.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </motion.button>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Backlog */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-900">
                  Backlog ({backlogTasks.length})
                </h3>
                <p className="text-sm text-gray-600">Tasks available for planning</p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {backlogTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Package" size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No tasks in backlog</p>
                  </div>
                ) : (
                  backlogTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative group cursor-pointer"
                      onClick={() => handleAddToSprint(task)}
                    >
                      <TaskCard task={task} layout="list" />
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Add to Sprint
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Sprint */}
            <div className="w-1/2 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-primary/5">
                <h3 className="font-medium text-gray-900">
                  {sprint.name} ({sprintTasks.length})
                </h3>
                <p className="text-sm text-gray-600">Tasks planned for this sprint</p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {sprintTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Timer" size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No tasks planned yet</p>
                    <p className="text-sm">Click tasks from backlog to add them</p>
                  </div>
                ) : (
                  sprintTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative group cursor-pointer"
                      onClick={() => handleRemoveFromSprint(task)}
                    >
                      <TaskCard task={task} layout="list" />
                      <div className="absolute inset-0 bg-error/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="bg-error text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Remove from Sprint
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SprintPlanningModal;