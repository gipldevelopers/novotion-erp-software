// src/app/(dashboard)/hr/assets/assignments/assign/page.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Calendar, User, Package } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';

export default function AssignAsset() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    employeeId: '',
    assignedDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
    conditionAssigned: 'excellent',
    notes: ''
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAssets = [
      { id: 'AST-001', name: 'Dell Latitude 5420', category: 'Laptop', status: 'available' },
      { id: 'AST-003', name: 'Ergonomic Chair', category: 'Furniture', status: 'available' },
      { id: 'AST-004', name: 'iPad Pro', category: 'Tablet', status: 'available' },
      { id: 'AST-006', name: 'Dell Monitor 27"', category: 'Monitor', status: 'available' }
    ];
    
    const mockEmployees = [
      { id: 'Emp-010', name: 'Lori Broaddus', department: 'Finance' },
      { id: 'Emp-011', name: 'John Smith', department: 'Engineering' },
      { id: 'Emp-012', name: 'Sarah Johnson', department: 'HR' },
      { id: 'Emp-013', name: 'Michael Brown', department: 'Product' }
    ];
    
    setAssets(mockAssets.filter(asset => asset.status === 'available'));
    setEmployees(mockEmployees);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, submit to API
    console.log('Asset assigned:', formData);
    router.push('/hr/assets/assignments');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate default return date (1 year from assignment)
  const calculateReturnDate = (date) => {
    if (!date) return '';
    const assignedDate = new Date(date);
    const returnDate = new Date(assignedDate);
    returnDate.setFullYear(returnDate.getFullYear() + 1);
    return returnDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (formData.assignedDate) {
      setFormData(prev => ({
        ...prev,
        expectedReturnDate: calculateReturnDate(formData.assignedDate)
      }));
    }
  }, [formData.assignedDate]);

  const selectedAsset = assets.find(asset => asset.id === formData.assetId);
  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        rightContent={
          <Link
            href="/hr/assets/assignments"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft size={18} /> Back to Assignments
          </Link>
        }
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Assign Asset to Employee</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Asset *
                </label>
                <select
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Asset</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Employee *
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="assignedDate"
                    value={formData.assignedDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Return Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="expectedReturnDate"
                    value={formData.expectedReturnDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition at Assignment *
                </label>
                <select
                  name="conditionAssigned"
                  value={formData.conditionAssigned}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Any special instructions or notes about this assignment"
              />
            </div>

            {/* Preview */}
            {(formData.assetId || formData.employeeId) && (
              <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Assignment Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.assetId && (
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedAsset?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedAsset?.category}
                        </p>
                      </div>
                    </div>
                  )}
                  {formData.employeeId && (
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedEmployee?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedEmployee?.department}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Link
                href="/hr/assets/assignments"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Assigning...' : 'Assign Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}