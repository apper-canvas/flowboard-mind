import React from 'react';
import { motion } from 'framer-motion';
import UserAvatar from '@/components/molecules/UserAvatar';

const TeamSettingsList = ({ users }) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-2">Team Management</h2>
      <p className="text-sm text-gray-600">Manage team members and permissions</p>
      <div className="space-y-4 mt-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <UserAvatar user={user} size="large" />
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{user.name}</h4>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                Active
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamSettingsList;