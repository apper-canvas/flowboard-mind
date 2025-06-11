import React from 'react';

const UserAvatar = ({ user, size = 'medium', className = '' }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const sizeClasses = {
    small: 'w-6 h-6 text-xs',
    medium: 'w-8 h-8 text-xs',
    large: 'w-10 h-10 text-sm',
  };

  return (
    <div className={`bg-primary rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      {user ? getInitials(user.name) : '??'}
    </div>
  );
};

export default UserAvatar;