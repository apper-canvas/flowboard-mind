import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const DashboardStats = ({ totalProjects, totalTasks, inProgressTasks, completedTasks, activeSprints }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        iconName="CheckCircle"
        iconColorClass="text-primary"
        label="Completed Tasks"
        value={completedTasks}
      />
      <StatCard
        iconName="Clock"
        iconColorClass="text-warning"
        label="In Progress Tasks"
        value={inProgressTasks}
      />
      <StatCard
        iconName="Timer"
        iconColorClass="text-info"
        label="Active Sprints"
        value={activeSprints}
      />
      <StatCard
        iconName="FolderOpen"
        iconColorClass="text-secondary"
        label="Total Projects"
        value={totalProjects}
      />
    </div>
  );
};

export default DashboardStats;