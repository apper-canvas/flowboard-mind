import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';

const KanbanColumn = ({ column, tasks, onDragStart, onDragOver, onDrop, onTaskClick, getAssigneeById }) => {
  return (
    <motion.div
      key={column.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm border h-fit max-h-full"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className={`p-4 rounded-t-lg border-b border-gray-200 ${column.color}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{column.title}</h3>
          <span className="px-2 py-1 bg-white text-sm text-gray-600 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto max-h-96">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Package" size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                draggable
                onDragStart={(e) => onDragStart(e, task)}
                className="cursor-move"
              >
                <TaskCard
                  task={task}
                  assignee={getAssigneeById(task.assigneeId)}
                  onClick={() => onTaskClick(task)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default KanbanColumn;