import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const ChartCard = ({ title, chartOptions, chartSeries, chartType = 'donut', chartHeight = 350, transitionDelay = 0.1, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: transitionDelay }}
      className="bg-white rounded-lg shadow-sm border"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {chartOptions && chartSeries ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type={chartType}
            height={chartHeight}
          />
        ) : children}
      </div>
    </motion.div>
  );
};

export default ChartCard;