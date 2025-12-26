// src/app/(dashboard)/hr/payroll/reports/page.js
"use client";
import { useState } from 'react';
import { Download, BarChart3, FileText, TrendingUp } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ReportList from './components/ReportList';
import ReportFilters from './components/ReportFilters';
import ReportChart from './components/ReportChart';

export default function PayrollReports() {
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleGenerateReport = () => {
    // This would generate the report based on filters
    console.log('Generating report with:', {
      reportType: selectedReportType,
      dateRange
    });
    alert('Report generated successfully!');
  };

  const handleDownloadReport = (report) => {
    console.log('Downloading report:', report);
    // In a real app, this would download the report
    alert(`Downloading ${report.name} report...`);
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb
        pageTitle="Payroll Reports"
        rightContent={null}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Report List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">24</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
                  <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">8</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-4">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generated</p>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Generate Report</h2>
              <button 
                onClick={handleGenerateReport}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
              >
                <BarChart3 size={18} />
                Generate Report
              </button>
            </div>
            
            <ReportFilters
              selectedReportType={selectedReportType}
              setSelectedReportType={setSelectedReportType}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>

          {/* Report List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <ReportList onDownload={handleDownloadReport} />
          </div>
        </div>

        {/* Charts and Visualizations */}
        <div className="space-y-6">
          <ReportChart 
            title="Payroll Distribution"
            type="doughnut"
            data={{
              labels: ['Basic Salary', 'Allowances', 'Deductions', 'Taxes', 'Bonuses'],
              datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                  '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B'
                ]
              }]
            }}
          />
          
          <ReportChart 
            title="Monthly Payroll Trend"
            type="line"
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Total Payroll ($)',
                data: [120000, 125000, 130000, 128000, 132000, 135000, 140000, 138000, 142000, 145000, 148000, 150000],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
}