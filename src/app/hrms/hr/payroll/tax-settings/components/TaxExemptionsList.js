// src/app/(dashboard)/hr/payroll/tax-settings/components/TaxExemptionsList.js
"use client";
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const TaxExemptionsList = () => {
  const [exemptions, setExemptions] = useState([
    { id: 1, name: 'Health Insurance', amount: 300, description: 'Monthly health insurance premium' },
    { id: 2, name: 'Retirement Contribution', amount: 500, description: '401k contribution' },
    { id: 3, name: 'Education Allowance', amount: 200, description: 'Education and training expenses' },
    { id: 4, name: 'Transportation', amount: 150, description: 'Monthly transportation costs' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newExemption, setNewExemption] = useState({
    name: '',
    amount: 0,
    description: ''
  });

  const handleAddExemption = () => {
    if (newExemption.name && newExemption.amount >= 0) {
      setExemptions([...exemptions, { ...newExemption, id: Date.now() }]);
      setNewExemption({ name: '', amount: 0, description: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteExemption = (id) => {
    setExemptions(exemptions.filter(exemption => exemption.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExemption(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Tax Exemptions</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Exemption
        </button>
      </div>

      {/* Add Exemption Form */}
      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Add New Tax Exemption</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exemption Name
              </label>
              <input
                type="text"
                name="name"
                value={newExemption.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                value={newExemption.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={newExemption.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExemption}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Exemption
            </button>
          </div>
        </div>
      )}

      {/* Exemptions List */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Exemption Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Amount ($)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {exemptions.map((exemption) => (
              <tr key={exemption.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {exemption.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  ${exemption.amount.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {exemption.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteExemption(exemption.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {exemptions.length} tax exemptions
      </div>
    </div>
  );
};

export default TaxExemptionsList;