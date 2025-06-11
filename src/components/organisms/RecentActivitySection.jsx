import React from 'react';
import RecentTasksList from '@/components/organisms/RecentTasksList';
import ProjectsOverviewList from '@/components/organisms/ProjectsOverviewList';

const RecentActivitySection = ({ tasks, projects }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentTasksList tasks={tasks} />
      <ProjectsOverviewList projects={projects} tasks={tasks} />
    </div>
  );
};

export default RecentActivitySection;