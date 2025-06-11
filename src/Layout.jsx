import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';
import ProjectSelector from './components/ProjectSelector';
import CreateTaskButton from './components/CreateTaskButton';
import SearchBar from './components/SearchBar';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-15 bg-white border-b border-gray-200 z-40">
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <ApperIcon name="Kanban" size={20} className="text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">FlowBoard</span>
            </div>
            
            {/* Project Selector */}
            <ProjectSelector />
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <SearchBar />
            
            {/* Create Task Button */}
            <CreateTaskButton />
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-50 bg-white border-r border-gray-200 z-40">
          <nav className="flex-1 p-4 space-y-1">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-white border-l-2 border-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={toggleMobileMenu}
              />
              
              {/* Mobile Sidebar */}
              <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                exit={{ x: -250 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 md:hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <ApperIcon name="Kanban" size={20} className="text-white" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">FlowBoard</span>
                    </div>
                    <button
                      onClick={toggleMobileMenu}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  
                  <nav className="space-y-1">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} />
                        <span>{route.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;