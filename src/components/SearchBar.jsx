import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import taskService from '../services/api/taskService';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTasks = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const tasks = await taskService.getAll();
        const filtered = tasks.filter(task =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setResults(filtered);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchTasks, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleTaskSelect = (task) => {
    setQuery('');
    setIsOpen(false);
    navigate('/board');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-success/10 text-success';
      case 'in-progress':
        return 'bg-warning/10 text-warning';
      case 'testing':
        return 'bg-info/10 text-info';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <ApperIcon
          name="Search"
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(query.length >= 2)}
          placeholder="Search tasks..."
          className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-80 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {query.length < 2 ? 'Type at least 2 characters' : 'No tasks found'}
              </div>
            ) : (
              <div className="p-2">
                {results.map((task, index) => (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTaskSelect(task)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        task.priority === 'high' ? 'bg-error' :
                        task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                          <ApperIcon
                            name="Flag"
                            size={12}
                            className={getPriorityColor(task.priority)}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;