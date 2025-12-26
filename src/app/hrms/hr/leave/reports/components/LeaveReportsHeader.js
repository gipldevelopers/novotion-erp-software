import { FileText, Download } from 'lucide-react';

const LeaveReportsHeader = () => {
  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting reports...');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive analysis of leave patterns and trends
        </p>
      </div>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
      >
        <Download size={18} />
        Export Report
      </button>
    </div>
  );
};

export default LeaveReportsHeader;