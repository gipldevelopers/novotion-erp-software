// src/app/(dashboard)/hr/assets/maintenance/add/page.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Calendar, DollarSign, User } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';

export default function AddMaintenanceRecord() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    maintenanceDate: new Date().toISOString().split('T')[0],
    maintenanceType: 'preventive',
    cost: '',
    technician: '',
    description: '',
    nextMaintenanceDate: '',
    status: 'completed'
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAssets = [
      { id: 'AST-001', name: 'Dell Latitude 5420', category: 'Laptop' },
      { id: 'AST-002', name: 'iPhone 13 Pro', category: 'Mobile Phone' },
      { id: 'AST-003', name: 'Ergonomic Chair', category: 'Furniture' },
      { id: 'AST-004', name: 'iPad Pro', category: 'Tablet' },
      { id: 'AST-005', name: 'MacBook Pro 16"', category: 'Laptop' },
      { id: 'AST-006', name: 'Dell Monitor 27"', category: 'Monitor' }
    ];
    
    setAssets(mockAssets);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, submit to API
    console.log('Maintenance record created:', formData);
    router.push('/hr/assets/maintenance');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate next maintenance date based on type
  const calculateNextMaintenanceDate = (date, type) => {
    if (!date) return '';
    const maintenanceDate = new Date(date);
    const nextDate = new Date(maintenanceDate);
    
    switch (type) {
      case 'preventive':
        nextDate.setMonth(nextDate.getMonth() + 3); // 3 months for preventive
        break;
      case 'corrective':
        nextDate.setMonth(nextDate.getMonth() + 6); // 6 months for corrective
        break;
      case 'emergency':
        nextDate.setMonth(nextDate.getMonth() + 1); // 1 month for emergency
        break;
      default:
        nextDate.setMonth(nextDate.getMonth() + 3);
    }
    
    return nextDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (formData.maintenanceDate && formData.maintenanceType) {
      setFormData(prev => ({
        ...prev,
        nextMaintenanceDate: calculateNextMaintenanceDate(prev.maintenanceDate, prev.maintenanceType)
      }));
    }
  }, [formData.maintenanceDate, formData.maintenanceType]);

  const selectedAsset = assets.find(asset => asset.id === formData.assetId);

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        rightContent={
          <Link
            href="/hr/assets/maintenance"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft size={18} /> Back to Maintenance
          </Link>
        }
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Maintenance Record</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maintenance Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="maintenanceDate"
                    value={formData.maintenanceDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maintenance Type *
                </label>
                <select
                  name="maintenanceType"
                  value={formData.maintenanceType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cost ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technician/Service *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="technician"
                    value={formData.technician}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Technician or service company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Next Maintenance Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="nextMaintenanceDate"
                    value={formData.nextMaintenanceDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe the maintenance performed or scheduled"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/hr/assets/maintenance"
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
                {loading ? 'Adding...' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}