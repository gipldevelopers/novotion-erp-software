// src/app/(dashboard)/hr/payroll/reports/components/ReportList.js
"use client";
import { Download, Eye, FileText, Calendar } from 'lucide-react';

const ReportList = ({ onDownload }) => {
  // Mock data for reports
  const reports = [
    {
      id: 'RPT-2023-12-001',
      name: 'December 2023 Payroll Summary',
      type: 'payroll-summary',
      generatedDate: '2023-12-31',
      period: 'December 2023',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 'RPT-2023-12-002',
      name: 'Q4 2023 Tax Report',
      type: 'tax-report',
      generatedDate: '2024-01-15',
      period: 'Q4 2023',
      size: '3.1 MB',
      format: 'Excel'
    },
    {
      id: 'RPT-2023-12-003',
      name: 'Department Wise Report - December',
      type: 'department-wise',
      generatedDate: '2024-01-05',
      period: 'December 2023',
      size: '1.8 MB',
      format: 'PDF'
    },
    {
      id: 'RPT-2023-11-001',
      name: 'November 2023 Payroll Summary',
      type: 'payroll-summary',
      generatedDate: '2023-11-30',
      period: 'November 2023',
      size: '2.3 MB',
      format: 'PDF'
    },
    {
      id: 'RPT-2023-11-002',
      name: 'Employee Wise Report - November',
      type: 'employee-wise',
      generatedDate: '2023-12-05',
      period: 'November 2023',
      size: '4.2 MB',
      format: 'Excel'
    },
    {
      id: 'RPT-2023-10-001',
      name: 'October 2023 Payroll Summary',
      type: 'payroll-summary',
      generatedDate: '2023-10-31',
      period: 'October 2023',
      size: '2.1 MB',
      format: 'PDF'
    },
  ];

  const getReportIcon = (format) => {
    if (format === 'PDF') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <FileText className="w-5 h-5 text-green-500" />;
    }
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      'payroll-summary': { label: 'Summary', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      'tax-report': { label: 'Tax', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      'department-wise': { label: 'Department', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      'employee-wise': { label: 'Employee', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      'default': { label: 'Report', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
    };
    
    const { label, color } = typeMap[type] || typeMap.default;
    return <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${color}`}>{label}</span>;
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Recent Reports</h2>
      
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {getReportIcon(report.format)}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">{report.name}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  {getTypeBadge(report.type)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {report.generatedDate}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{report.period}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{report.size}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDownload(report)}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          View All Reports →
        </button>
      </div>
    </div>
  );
};

export default ReportList;