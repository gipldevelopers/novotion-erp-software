// src/app/(dashboard)/hr/payroll/tax-settings/components/TaxBracketsTable.js
"use client";
import { useState } from 'react';
import { Plus, Edit, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const TaxBracketsTable = () => {
  const [brackets, setBrackets] = useState([
    { id: 1, minIncome: 0, maxIncome: 10275, rate: 10, description: 'First Bracket' },
    { id: 2, minIncome: 10276, maxIncome: 41775, rate: 12, description: 'Second Bracket' },
    { id: 3, minIncome: 41776, maxIncome: 89075, rate: 22, description: 'Third Bracket' },
    { id: 4, minIncome: 89076, maxIncome: 170050, rate: 24, description: 'Fourth Bracket' },
    { id: 5, minIncome: 170051, maxIncome: 215950, rate: 32, description: 'Fifth Bracket' },
    { id: 6, minIncome: 215951, maxIncome: 539900, rate: 35, description: 'Sixth Bracket' },
    { id: 7, minIncome: 539901, maxIncome: null, rate: 37, description: 'Seventh Bracket' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newBracket, setNewBracket] = useState({
    minIncome: 0,
    maxIncome: null,
    rate: 0,
    description: ''
  });

  const handleAddBracket = () => {
    if (newBracket.minIncome >= 0 && newBracket.rate >= 0) {
      setBrackets([...brackets, { ...newBracket, id: Date.now() }]);
      setNewBracket({ minIncome: 0, maxIncome: null, rate: 0, description: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteBracket = (id) => {
    setBrackets(brackets.filter(bracket => bracket.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBracket(prev => ({
      ...prev,
      [name]: name === 'minIncome' || name === 'maxIncome' || name === 'rate' 
        ? (value === '' ? null : parseFloat(value)) 
        : value
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Tax Brackets</h2>
        {/* <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Bracket
        </button> */}
         <Link
            href="/hr/payroll/tax-settings/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Bracket
          </Link>
      </div>

      {/* Add Bracket Form */}
      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Add New Tax Bracket</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Income ($)
              </label>
              <input
                type="number"
                name="minIncome"
                value={newBracket.minIncome || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Income ($)
              </label>
              <input
                type="number"
                name="maxIncome"
                value={newBracket.maxIncome || ''}
                onChange={handleInputChange}
                placeholder="Leave empty for no limit"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="rate"
                value={newBracket.rate || ''}
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
                value={newBracket.description}
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
              onClick={handleAddBracket}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Bracket
            </button>
          </div>
        </div>
      )}

      {/* Brackets Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Min Income ($)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Max Income ($)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                Rate (%)
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
            {brackets.map((bracket) => (
              <tr key={bracket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {bracket.minIncome.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {bracket.maxIncome ? bracket.maxIncome.toLocaleString() : 'No limit'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                  {bracket.rate}%
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {bracket.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                     <Link
                        href={`/hr/payroll/tax-settings/edit/${bracket.id}`}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        title="Edit bracket"
                        >
                        <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDeleteBracket(bracket.id)}
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
        Showing {brackets.length} tax brackets
      </div>
    </div>
  );
};

export default TaxBracketsTable;