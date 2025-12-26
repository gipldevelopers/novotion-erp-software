// src/app/(dashboard)/hr/assets/page.js
"use client";
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, MoreHorizontal, Eye, Edit, Trash2, QrCode } from 'lucide-react';
import AssetTable from './components/AssetTable';
import AssetStats from './components/AssetStats';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';

export default function AssetInventory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    condition: 'all',
    search: ''
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAssets = [
      {
        id: 'AST-001',
        name: 'Dell Latitude 5420',
        category: 'Laptop',
        serialNumber: 'DL5420X12345',
        model: 'Latitude 5420',
        manufacturer: 'Dell',
        purchaseDate: '2023-01-15',
        purchaseCost: 1200,
        currentValue: 850,
        status: 'assigned',
        condition: 'excellent',
        location: 'New York Office',
        assignedTo: 'Emp-010',
        assignmentDate: '2023-01-20',
        warrantyExpiry: '2025-01-14',
        maintenanceSchedule: 'quarterly',
        notes: '15.6" FHD Display, 16GB RAM, 512GB SSD',
        createdAt: '2023-01-15',
        updatedAt: '2023-01-20'
      },
      {
        id: 'AST-002',
        name: 'iPhone 13 Pro',
        category: 'Mobile Phone',
        serialNumber: 'IP13P67890',
        model: 'iPhone 13 Pro',
        manufacturer: 'Apple',
        purchaseDate: '2023-02-10',
        purchaseCost: 999,
        currentValue: 750,
        status: 'assigned',
        condition: 'good',
        location: 'New York Office',
        assignedTo: 'Emp-011',
        assignmentDate: '2023-02-15',
        warrantyExpiry: '2024-02-09',
        maintenanceSchedule: 'yearly',
        notes: '128GB, Sierra Blue',
        createdAt: '2023-02-10',
        updatedAt: '2023-02-15'
      },
      {
        id: 'AST-003',
        name: 'Ergonomic Chair',
        category: 'Furniture',
        serialNumber: 'ERGCHAIR456',
        model: 'ErgoComfort Pro',
        manufacturer: 'Herman Miller',
        purchaseDate: '2023-03-01',
        purchaseCost: 450,
        currentValue: 380,
        status: 'available',
        condition: 'excellent',
        location: 'Warehouse',
        warrantyExpiry: '2026-03-01',
        maintenanceSchedule: 'yearly',
        notes: 'Adjustable height and lumbar support',
        createdAt: '2023-03-01',
        updatedAt: '2023-03-01'
      }
    ];
    setAssets(mockAssets);
    setLoading(false);
  }, []);

  const handleDeleteAsset = (assetId) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(asset => asset.id !== assetId));
    }
  };

  const filteredAssets = assets.filter(asset => {
    if (filters.status !== 'all' && asset.status !== filters.status) return false;
    if (filters.category !== 'all' && asset.category !== filters.category) return false;
    if (filters.condition !== 'all' && asset.condition !== filters.condition) return false;
    if (filters.search && !asset.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        rightContent={
          <div className="flex gap-2">
            <Link
              href="/hr/assets/add"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Add Asset
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition">
              <Download size={18} /> Export
            </button>
          </div>
        }
      />

      <AssetStats assets={assets} />
      <AssetTable 
        assets={filteredAssets} 
        loading={loading}
        filters={filters}
        onFilterChange={setFilters}
        onDeleteAsset={handleDeleteAsset}
      />
    </div>
  );
}