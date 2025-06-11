import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import ChartCard from '@/components/molecules/ChartCard';

const ReportsChartsSection = ({ taskStatusData, priorityData, sprintProgressData, sprints }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Task Status Distribution"
        chartOptions={taskStatusData.options}
        chartSeries={taskStatusData.series}
        chartType="donut"
        transitionDelay={0.1}
      />

      <ChartCard
        title="Task Priority"
        chartOptions={priorityData.options}
        chartSeries={priorityData.series}
        chartType="bar"
        transitionDelay={0.2}
      />

      <ChartCard
        title="Sprint Progress"
        transitionDelay={0.3}
        className="lg:col-span-2"
      >
        {sprints.length > 0 ? (
          <ChartCard.Chart
            options={sprintProgressData.options}
            series={sprintProgressData.series}
            type="bar"
            height={350}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ApperIcon name="Timer" size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No sprints available for reporting</p>
          </div>
        )}
      </ChartCard>
    </div>
  );
};

// This is a workaround to "pass" the Chart component from ChartCard to its consumer.
// In a real scenario, you might pass Chart as a prop or structure it differently.
// For this refactoring, we need Chart to be available inside ReportsChartsSection
// to render the specific "no sprints" message when no data is available.
ReportsChartsSection.Chart = ChartCard; 

export default ReportsChartsSection;