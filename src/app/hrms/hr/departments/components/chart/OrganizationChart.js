"use client";
import { useState, useEffect } from 'react';
import EmployeeNode from './EmployeeNode';

// Mock data structure - replace with API call
const mockOrganizationData = {
  id: 1,
  name: "CEO",
  position: "Chief Executive Officer",
  department: "Executive",
  avatar: "/avatars/ceo.jpg",
  status: "Active",
  email: "ceo@company.com",
  phone: "+1 (555) 123-4567",
  reports: [
    {
      id: 2,
      name: "CFO",
      position: "Chief Financial Officer",
      department: "Finance",
      avatar: "/avatars/cfo.jpg",
      status: "Active",
      email: "cfo@company.com",
      phone: "+1 (555) 123-4568",
      reports: [
        {
          id: 3,
          name: "Finance Manager",
          position: "Finance Department Manager",
          department: "Finance",
          avatar: "/avatars/finance-mgr.jpg",
          status: "Active",
          email: "finance@company.com",
          phone: "+1 (555) 123-4569",
          reports: []
        }
      ]
    },
    {
      id: 4,
      name: "CTO",
      position: "Chief Technology Officer",
      department: "Technology",
      avatar: "/avatars/cto.jpg",
      status: "Active",
      email: "cto@company.com",
      phone: "+1 (555) 123-4570",
      reports: [
        {
          id: 5,
          name: "Development Manager",
          position: "Development Team Lead",
          department: "Technology",
          avatar: "/avatars/dev-mgr.jpg",
          status: "Active",
          email: "dev@company.com",
          phone: "+1 (555) 123-4571",
          reports: [
            {
              id: 6,
              name: "Senior Developer",
              position: "Senior Software Engineer",
              department: "Technology",
              avatar: "/avatars/senior-dev.jpg",
              status: "Active",
              email: "developer@company.com",
              phone: "+1 (555) 123-4572",
              reports: []
            }
          ]
        }
      ]
    },
    {
      id: 7,
      name: "HR Director",
      position: "Human Resources Director",
      department: "Human Resources",
      avatar: "/avatars/hr-director.jpg",
      status: "Active",
      email: "hr@company.com",
      phone: "+1 (555) 123-4573",
      reports: [
        {
          id: 8,
          name: "HR Manager",
          position: "HR Department Manager",
          department: "Human Resources",
          avatar: "/avatars/hr-mgr.jpg",
          status: "Active",
          email: "hrmgr@company.com",
          phone: "+1 (555) 123-4574",
          reports: []
        }
      ]
    }
  ]
};

export default function OrganizationChart() {
  const [chartData, setChartData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set([1])); // Start with CEO expanded
  const [viewMode, setViewMode] = useState('hierarchical'); // hierarchical, departmental, flat
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      // In real implementation, fetch from API
      setChartData(mockOrganizationData);
    };
    fetchData();
  }, []);

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        <EmployeeNode
          node={node}
          depth={depth}
          isExpanded={isExpanded}
          onToggle={() => toggleNode(node.id)}
        />
        
        {isExpanded && node.reports && node.reports.length > 0 && (
          <div className="flex justify-center space-x-8 mt-6">
            {node.reports.map(report => renderNode(report, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-auto p-4">
      <div className="inline-block min-w-full">
        {renderNode(chartData)}
      </div>
    </div>
  );
}