import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';

const LeaveStatsCards = ({ filters }) => {
  // Mock data - in real app, this would come from API based on filters
  const stats = {
    totalLeaves: 247,
    approvedLeaves: 189,
    pendingLeaves: 32,
    rejectedLeaves: 26,
    averageLeaveDuration: 2.8,
    leaveUtilization: '68%'
  };

  const statCards = [
    {
      title: 'Total Leaves',
      value: stats.totalLeaves,
      icon: <Calendar className="w-5 h-5" />,
      change: '+12%',
      trend: 'up',
      description: 'This period'
    },
    {
      title: 'Approved Leaves',
      value: stats.approvedLeaves,
      icon: <Users className="w-5 h-5" />,
      change: '+8%',
      trend: 'up',
      description: '76% approval rate'
    },
    {
      title: 'Avg. Duration',
      value: `${stats.averageLeaveDuration} days`,
      icon: <Clock className="w-5 h-5" />,
      change: '-0.3',
      trend: 'down',
      description: 'Per leave request'
    },
    {
      title: 'Utilization Rate',
      value: stats.leaveUtilization,
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+5%',
      trend: 'up',
      description: 'Of available leave days'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.description}</p>
            </div>
            <div className={`p-3 rounded-lg ${
              index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
              index === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
              index === 2 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
              'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              {card.icon}
            </div>
          </div>
          <div className={`flex items-center mt-3 text-xs ${
            card.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <span>{card.change}</span>
            <span className="ml-1">from previous period</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveStatsCards;