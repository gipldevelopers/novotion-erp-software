// src/app/(dashboard)/hr/assets/reports/page.js
"use client";
import { useState, useEffect } from 'react';
import { Download, Filter, BarChart3, PieChart, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import dynamic from 'next/dynamic';

// Dynamically import chart components (to avoid SSR issues)
const InventoryCharts = dynamic(() => import('./components/InventoryCharts'), { ssr: false });
const MaintenanceCharts = dynamic(() => import('./components/MaintenanceCharts'), { ssr: false });
const DepreciationCharts = dynamic(() => import('./components/DepreciationCharts'), { ssr: false });
const AssignmentCharts = dynamic(() => import('./components/AssignmentCharts'), { ssr: false });

// Import DateRangePicker
import DateRangePicker from '@/app/hrms/components/form/date/DateRangePicker';

export default function AssetReports() {
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState('inventory');
  const [dateRange, setDateRange] = useState([]);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch report data
    const fetchReportData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data based on report type
      const mockData = {
        inventory: {
          title: "Asset Inventory Report",
          description: "Complete inventory of all company assets",
          data: {
            totalAssets: 245,
            totalValue: 187500,
            byCategory: [
              { category: 'Laptops', count: 45, value: 67500 },
              { category: 'Mobile Phones', count: 32, value: 24000 },
              { category: 'Furniture', count: 120, value: 45000 },
              { category: 'Monitors', count: 28, value: 28000 },
              { category: 'Servers', count: 8, value: 16000 },
              { category: 'Other', count: 12, value: 7000 }
            ],
            byStatus: [
              { status: 'Assigned', count: 180, value: 135000 },
              { status: 'Available', count: 45, value: 33750 },
              { status: 'Maintenance', count: 15, value: 11250 },
              { status: 'Retired', count: 5, value: 7500 }
            ]
          }
        },
        maintenance: {
          title: "Maintenance Cost Report",
          description: "Analysis of maintenance costs by category and time period",
          data: {
            totalCost: 5250,
            averageCost: 175,
            byCategory: [
              { category: 'Laptops', cost: 2250, count: 15 },
              { category: 'Mobile Phones', cost: 1200, count: 8 },
              { category: 'Servers', cost: 1000, count: 2 },
              { category: 'Other', cost: 800, count: 5 }
            ],
            byMonth: [
              { month: 'Jan', cost: 850 },
              { month: 'Feb', cost: 720 },
              { month: 'Mar', cost: 630 },
              { month: 'Apr', cost: 920 },
              { month: 'May', cost: 780 },
              { month: 'Jun', cost: 650 },
              { month: 'Jul', cost: 800 }
            ]
          }
        },
        depreciation: {
          title: "Asset Depreciation Report",
          description: "Depreciation analysis of company assets",
          data: {
            totalDepreciation: 56250,
            byCategory: [
              { category: 'Laptops', depreciation: 20250, rate: 25 },
              { category: 'Mobile Phones', depreciation: 9600, rate: 33.33 },
              { category: 'Furniture', depreciation: 13500, rate: 10 },
              { category: 'Servers', depreciation: 8000, rate: 20 },
              { category: 'Other', depreciation: 4900, rate: 15 }
            ],
            forecast: [
              { year: '2023', value: 187500 },
              { year: '2024', value: 131250 },
              { year: '2025', value: 91875 },
              { year: '2026', value: 64313 }
            ]
          }
        },
        assignments: {
          title: "Assignment History Report",
          description: "Historical analysis of asset assignments and returns",
          data: {
            totalAssignments: 210,
            activeAssignments: 180,
            byDepartment: [
              { department: 'Engineering', count: 65 },
              { department: 'Sales', count: 42 },
              { department: 'Marketing', count: 28 },
              { department: 'HR', count: 25 },
              { department: 'Finance', count: 20 },
              { department: 'Operations', count: 30 }
            ],
            byMonth: [
              { month: 'Jan', assignments: 25, returns: 18 },
              { month: 'Feb', assignments: 32, returns: 22 },
              { month: 'Mar', assignments: 28, returns: 25 },
              { month: 'Apr', assignments: 35, returns: 28 },
              { month: 'May', assignments: 40, returns: 32 },
              { month: 'Jun', assignments: 30, returns: 25 },
              { month: 'Jul', assignments: 20, returns: 15 }
            ]
          }
        }
      };

      setReportData(mockData[activeReport]);
      setLoading(false);
    };

    fetchReportData();
  }, [activeReport]);

  const reports = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Complete inventory of all assets',
      icon: Package
    },
    {
      id: 'maintenance',
      title: 'Maintenance Costs',
      description: 'Maintenance expense analysis',
      icon: DollarSign
    },
    {
      id: 'depreciation',
      title: 'Depreciation',
      description: 'Asset depreciation reports',
      icon: TrendingUp
    },
    {
      id: 'assignments',
      title: 'Assignment History',
      description: 'Assignment and return analysis',
      icon: BarChart3
    }
  ];

  const handleGenerateReport = () => {
    // In a real app, this would generate the report based on filters
    console.log('Generating report with filters:', { activeReport, dateRange });
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = (format) => {
    // In a real app, this would export the report
    console.log(`Exporting ${activeReport} report as ${format}`);
    alert(`Exporting ${activeReport} report as ${format.toUpperCase()}`);
  };

  const renderCharts = () => {
    if (!reportData || !reportData.data) return null;

    switch (activeReport) {
      case 'inventory':
        return <InventoryCharts data={reportData.data} />;
      case 'maintenance':
        return <MaintenanceCharts data={reportData.data} />;
      case 'depreciation':
        return <DepreciationCharts data={reportData.data} />;
      case 'assignments':
        return <AssignmentCharts data={reportData.data} />;
      default:
        return null;
    }
  };

  // Add safe access functions
  const getSafeValue = (value) => {
    return value ? value.toLocaleString() : '0';
  };

  const getSafeNumber = (value) => {
    return value || 0;
  };

  if (loading && !reportData) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <Breadcrumb />
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        rightContent={
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Download size={18} /> Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Download size={18} /> Export Excel
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Types</h2>
            <div className="space-y-2">
              {reports.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setActiveReport(report.id)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${activeReport === report.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm opacity-75">{report.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
            {reportData && reportData.data && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {reportData.description}
                    </p>
                  </div>
                </div>

                {/* Filters - Updated with DateRangePicker */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      placeholder="Select date range for report"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateReport}
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </div>

                {/* Report Content */}
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeReport === 'inventory' && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/20">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Assets</h3>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {getSafeNumber(reportData.data.totalAssets)}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 dark:bg-green-900/20">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Total Value</h3>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            ${getSafeValue(reportData.data.totalValue)}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 dark:bg-purple-900/20">
                          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Avg. Value</h3>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            ${getSafeValue(Math.round(reportData.data.totalValue / reportData.data.totalAssets))}
                          </p>
                        </div>
                      </>
                    )}
                    {activeReport === 'maintenance' && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/20">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Cost</h3>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            ${getSafeValue(reportData.data.totalCost)}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 dark:bg-green-900/20">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Average Cost</h3>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            ${getSafeValue(reportData.data.averageCost)}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 dark:bg-purple-900/20">
                          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Maintenance Events</h3>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {getSafeNumber(reportData.data.byCategory?.reduce((sum, item) => sum + item.count, 0))}
                          </p>
                        </div>
                      </>
                    )}
                    {activeReport === 'depreciation' && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/20">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Depreciation</h3>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            ${getSafeValue(reportData.data.totalDepreciation)}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 dark:bg-green-900/20">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Current Value</h3>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            ${getSafeValue(187500 - reportData.data.totalDepreciation)}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 dark:bg-purple-900/20">
                          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Avg. Depreciation Rate</h3>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {Math.round(reportData.data.byCategory?.reduce((sum, item) => sum + item.rate, 0) / (reportData.data.byCategory?.length || 1)) || 0}%
                          </p>
                        </div>
                      </>
                    )}
                    {activeReport === 'assignments' && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4 dark:bg-blue-900/20">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Assignments</h3>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {getSafeNumber(reportData.data.totalAssignments)}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 dark:bg-green-900/20">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Active Assignments</h3>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {getSafeNumber(reportData.data.activeAssignments)}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 dark:bg-purple-900/20">
                          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Return Rate</h3>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {Math.round((getSafeNumber(reportData.data.totalAssignments) - getSafeNumber(reportData.data.activeAssignments)) / getSafeNumber(reportData.data.totalAssignments) * 100) || 0}%
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Charts Section - Replaced placeholder with actual charts */}
                  {renderCharts()}

                  {/* Data Tables */}
                  <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {activeReport === 'inventory' && 'Assets by Category'}
                      {activeReport === 'maintenance' && 'Costs by Category'}
                      {activeReport === 'depreciation' && 'Depreciation by Category'}
                      {activeReport === 'assignments' && 'Assignments by Department'}
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                              Category
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                              {activeReport === 'inventory' ? 'Count' : activeReport === 'maintenance' ? 'Cost' : activeReport === 'depreciation' ? 'Depreciation' : 'Count'}
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                              {activeReport === 'inventory' ? 'Value' : activeReport === 'maintenance' ? 'Events' : activeReport === 'depreciation' ? 'Rate' : 'Percentage'}
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {activeReport === 'inventory' && reportData.data.byCategory?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.count}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">${getSafeValue(item.value)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {Math.round(item.count / getSafeNumber(reportData.data.totalAssets) * 100)}%
                              </td>
                            </tr>
                          ))}
                          {activeReport === 'maintenance' && reportData.data.byCategory?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">${getSafeValue(item.cost)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.count}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {Math.round(item.cost / getSafeNumber(reportData.data.totalCost) * 100)}%
                              </td>
                            </tr>
                          ))}
                          {activeReport === 'depreciation' && reportData.data.byCategory?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">${getSafeValue(item.depreciation)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.rate}%</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {Math.round(item.depreciation / getSafeNumber(reportData.data.totalDepreciation) * 100)}%
                              </td>
                            </tr>
                          ))}
                          {activeReport === 'assignments' && reportData.data.byDepartment?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.department}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.count}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {Math.round(item.count / getSafeNumber(reportData.data.totalAssignments) * 100)}%
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${Math.round(item.count / getSafeNumber(reportData.data.totalAssignments) * 100)}%` }}
                                  ></div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}