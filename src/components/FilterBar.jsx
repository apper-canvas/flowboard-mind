import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import userService from '../services/api/userService';
import sprintService from '../services/api/sprintService';

const FilterBar = ({ filters, onFiltersChange }) => {
  const [users, setUsers] = useState([]);
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      const [usersData, sprintsData] = await Promise.all([
        userService.getAll(),
        sprintService.getAll()
      ]);
      setUsers(usersData);
      setSprints(sprintsData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      assignee: '',
      priority: '',
      status: '',
      sprint: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        <ApperIcon name="Filter" size={16} />
        <span>Filters:</span>
      </div>

      {/* Assignee Filter */}
      <select
        value={filters.assignee}
        onChange={(e) => handleFilterChange('assignee', e.target.value)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">All Assignees</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">All Statuses</option>
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="testing">Testing</option>
        <option value="done">Done</option>
      </select>

      {/* Sprint Filter */}
      <select
        value={filters.sprint}
        onChange={(e) => handleFilterChange('sprint', e.target.value)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">All Sprints</option>
        {sprints.map(sprint => (
          <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </motion.button>
      )}
    </div>
  );
};

export default FilterBar;