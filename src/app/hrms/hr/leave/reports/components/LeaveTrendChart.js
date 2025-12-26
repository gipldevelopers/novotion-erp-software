"use client";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LeaveTrendChart = ({ filters }) => {
  // Chart options
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    markers: {
      size: 5
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#6b7280'
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (value) {
          return value + " leaves";
        }
      }
    }
  };

  // Chart series data
  const chartSeries = [
    {
      name: 'Total Leaves',
      data: [45, 52, 48, 61, 55, 67, 72, 65, 58, 63, 59, 71]
    },
    {
      name: 'Approved',
      data: [38, 42, 40, 52, 47, 58, 63, 56, 50, 55, 51, 62]
    },
    {
      name: 'Pending',
      data: [7, 10, 8, 9, 8, 9, 9, 9, 8, 8, 8, 9]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Leave Trends Over Time
      </h3>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default LeaveTrendChart;