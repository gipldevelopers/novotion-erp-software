"use client";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LeaveByTypeChart = ({ filters }) => {
  // Chart options
  const chartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'],
    labels: ['Annual Leave', 'Sick Leave', 'Maternity', 'Emergency', 'Unpaid'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Leaves',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.globals.labels[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
      },
      dropShadow: {
        enabled: false
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#6b7280'
      }
    },
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex, w }) {
          return value + ' leaves';
        }
      }
    }
  };

  // Chart series data
  const chartSeries = [45, 30, 12, 8, 5];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Leave Distribution by Type
      </h3>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default LeaveByTypeChart;