"use client";
import { ChevronDown, ChevronRight, User, Mail, Phone, Building } from 'lucide-react';
import { useState } from 'react';

export default function EmployeeNode({ node, depth, isExpanded, onToggle }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const nodeWidth = 280;
  const nodeHeight = 120;
  
  const statusColors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    OnLeave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return (
    <div className="relative">
      {/* Connecting line */}
      {depth > 0 && (
        <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gray-300 dark:bg-gray-600"></div>
      )}
      
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 ${
          showDetails ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ width: `${nodeWidth}px`, minHeight: `${nodeHeight}px` }}
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Node Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {node.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {node.position}
              </p>
            </div>
          </div>
          
          {node.reports && node.reports.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
          )}
        </div>

        {/* Node Details */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Building size={14} className="mr-2" />
            <span>{node.department}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[node.status]}`}>
              {node.status}
            </span>
            
            {node.reports && node.reports.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {node.reports.length} report{node.reports.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Mail size={14} className="mr-2" />
              <a href={`mailto:${node.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                {node.email}
              </a>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Phone size={14} className="mr-2" />
              <a href={`tel:${node.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                {node.phone}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Expand/Collapse Indicator */}
      {node.reports && node.reports.length > 0 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {node.reports.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}