// src/app/(dashboard)/hr/assets/components/AssetStats.js
"use client";
import { Package, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';

export default function AssetStats({ assets }) {
  const stats = {
    total: assets.length,
    assigned: assets.filter(a => a.status === 'assigned').length,
    available: assets.filter(a => a.status === 'available').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
    totalValue: assets.reduce((sum, asset) => sum + asset.currentValue, 0)
  };

  const cardData = [
    {
      title: "Total Assets",
      value: stats.total,
      icon: Package,
      color: "bg-blue-500",
      trend: "+12%"
    },
    {
      title: "Assigned Assets",
      value: stats.assigned,
      icon: CheckCircle,
      color: "bg-green-500",
      trend: "+8%"
    },
    {
      title: "Under Maintenance",
      value: stats.maintenance,
      icon: AlertTriangle,
      color: "bg-yellow-500",
      trend: "+3%"
    },
    {
      title: "Total Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      trend: "+15%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardData.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <span className="text-xs text-green-600 dark:text-green-400">
                  {card.trend}
                </span>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}