// "use client";
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { PlusCircle, Calendar, Coins, FileText, IndianRupee, Clock, Trash2, Edit } from 'lucide-react';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import Link from 'next/link';

// // Mock data for leave types
// const initialLeaveTypes = [
//   {
//     id: 1,
//     name: "Annual Leave",
//     icon: "🏖️",
//     isPaid: true,
//     limitDays: 21,
//     requireAttachment: false,
//     isEncashable: true,
//     description: "Paid time off for vacation and personal reasons",
//     accrualRate: "1.75 days per month",
//     carryOver: "Up to 5 days",
//     eligibility: "After 6 months of employment"
//   },
//   {
//     id: 2,
//     name: "Sick Leave",
//     icon: "🤒",
//     isPaid: true,
//     limitDays: 14,
//     requireAttachment: true,
//     isEncashable: false,
//     description: "Paid time off for illness or medical appointments",
//     accrualRate: "1 day per month",
//     carryOver: "Up to 10 days",
//     eligibility: "Immediate"
//   },
//   {
//     id: 3,
//     name: "Maternity Leave",
//     icon: "👶",
//     isPaid: true,
//     limitDays: 90,
//     requireAttachment: true,
//     isEncashable: false,
//     description: "Paid leave for childbirth and recovery",
//     accrualRate: "N/A",
//     carryOver: "N/A",
//     eligibility: "After 1 year of employment"
//   },
//   {
//     id: 4,
//     name: "Paternity Leave",
//     icon: "👨‍👦",
//     isPaid: true,
//     limitDays: 14,
//     requireAttachment: true,
//     isEncashable: false,
//     description: "Paid leave for new fathers",
//     accrualRate: "N/A",
//     carryOver: "N/A",
//     eligibility: "After 1 year of employment"
//   },
//   {
//     id: 5,
//     name: "Unpaid Leave",
//     icon: "⏸️",
//     isPaid: false,
//     limitDays: 30,
//     requireAttachment: false,
//     isEncashable: false,
//     description: "Unpaid time off for personal reasons",
//     accrualRate: "N/A",
//     carryOver: "N/A",
//     eligibility: "After 3 months of employment"
//   },
//   {
//     id: 6,
//     name: "Emergency Leave",
//     icon: "🚨",
//     isPaid: true,
//     limitDays: 5,
//     requireAttachment: true,
//     isEncashable: false,
//     description: "Paid leave for emergency situations",
//     accrualRate: "N/A",
//     carryOver: "N/A",
//     eligibility: "Immediate"
//   }
// ];

// export default function LeaveTypes() {
//   const router = useRouter();
//   const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);
//   const [selectedType, setSelectedType] = useState(null);
//   const [showDetail, setShowDetail] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const handleCardClick = (leaveType) => {
//     setSelectedType(leaveType);
//     setShowDetail(true);
//   };

//   const closeDetail = () => {
//     setShowDetail(false);
//     setTimeout(() => setSelectedType(null), 300);
//   };

//   const handleEdit = (leaveType) => {
//     router.push(`/hr/leave/types/edit/${leaveType.id}`);
//   };

//   const handleDeleteClick = () => {
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = () => {
//     if (selectedType) {
//       setLeaveTypes(prev => prev.filter(type => type.id !== selectedType.id));
//       setShowDeleteConfirm(false);
//       closeDetail();
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteConfirm(false);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
//       {/* Breadcrumb with Add Leave Type button */}
//       <Breadcrumb
//         pages={[
//           { name: 'HR', href: '/hr' },
//           { name: 'Leave', href: '/hr/leave' },
//           { name: 'Leave Types', href: '#' },
//         ]}
//         rightContent={
//           <Link
//             href="/hr/leave/types/add"
//             className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
//           >
//             <PlusCircle size={18} /> Add Leave Type
//           </Link>
//         }
//       />

//       {/* Header */}
//       <div className="mt-6 mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Types</h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-1">
//           Manage different types of leave available to employees
//         </p>
//       </div>

//       {/* Leave Types Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {leaveTypes.map((leaveType) => (
//           <div
//             key={leaveType.id}
//             onClick={() => handleCardClick(leaveType)}
//             className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <span className="text-2xl mr-3">{leaveType.icon}</span>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {leaveType.name}
//                 </h3>
//               </div>
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 leaveType.isPaid 
//                   ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
//                   : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//               }`}>
//                 {leaveType.isPaid ? 'Paid' : 'Unpaid'}
//               </span>
//             </div>

//             {/* Details */}
//             <div className="space-y-2">
//               <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//                 <Clock className="w-4 h-4 mr-2" />
//                 <span>{leaveType.limitDays} days per year</span>
//               </div>
              
//               {leaveType.requireAttachment && (
//                 <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//                   <FileText className="w-4 h-4 mr-2" />
//                   <span>Documentation required</span>
//                 </div>
//               )}
              
//               {leaveType.isEncashable && (
//                 <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//                   <IndianRupee className="w-4 h-4 mr-2" />
//                   <span>Encashment available</span>
//                 </div>
//               )}
//             </div>

//             {/* View Details CTA */}
//             <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//               <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
//                 Click to view details →
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Detail Popup */}
//       {selectedType && (
//         <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
//           showDetail ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}>
//           <div className={`bg-white dark:bg-gray-800 rounded-lg w-full max-w-md transform transition-transform duration-300 ${
//             showDetail ? 'scale-100' : 'scale-95'
//           }`}>
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex items-center">
//                 <span className="text-2xl mr-3">{selectedType.icon}</span>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {selectedType.name}
//                 </h3>
//               </div>
//               <button
//                 onClick={closeDetail}
//                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
//                   <p className="font-medium text-gray-900 dark:text-white">
//                     {selectedType.isPaid ? 'Paid Leave' : 'Unpaid Leave'}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Annual Limit</p>
//                   <p className="font-medium text-gray-900 dark:text-white">
//                     {selectedType.limitDays} days
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Attachment</p>
//                   <p className="font-medium text-gray-900 dark:text-white">
//                     {selectedType.requireAttachment ? 'Required' : 'Not Required'}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Encashment</p>
//                   <p className="font-medium text-gray-900 dark:text-white">
//                     {selectedType.isEncashable ? 'Available' : 'Not Available'}
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
//                 <p className="font-medium text-gray-900 dark:text-white mt-1">
//                   {selectedType.description}
//                 </p>
//               </div>

//               {selectedType.accrualRate && selectedType.accrualRate !== 'N/A' && (
//                 <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Accrual Rate</p>
//                   <p className="font-medium text-gray-900 dark:text-white mt-1">
//                     {selectedType.accrualRate}
//                   </p>
//                 </div>
//               )}

//               {selectedType.carryOver && selectedType.carryOver !== 'N/A' && (
//                 <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Carry Over</p>
//                   <p className="font-medium text-gray-900 dark:text-white mt-1">
//                     {selectedType.carryOver}
//                   </p>
//                 </div>
//               )}

//               {selectedType.eligibility && (
//                 <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Eligibility</p>
//                   <p className="font-medium text-gray-900 dark:text-white mt-1">
//                     {selectedType.eligibility}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="flex justify-between p-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={handleDeleteClick}
//                 className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete
//               </button>
//               <div className="flex gap-3">
//                 <button
//                   onClick={closeDetail}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={() => handleEdit(selectedType)}
//                   className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Edit className="w-4 h-4 mr-2" />
//                   Edit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//               Confirm Delete
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Are you sure you want to delete the leave type "{selectedType?.name}"? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={cancelDelete}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/app/(dashboard)/hr/leave/types/page.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Calendar, Coins, FileText, IndianRupee, Clock } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import LeaveTypeDetail from '../components/LeaveTypeDetail';
import Link from 'next/link';
import { leaveTypeService } from '@/services/leaveTypeService';
import { toast } from 'sonner';

export default function LeaveTypes() {
  const router = useRouter();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      const response = await leaveTypeService.getAllLeaveTypes();
      setLeaveTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      toast.error(error.message || 'Failed to fetch leave types');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (leaveType) => {
    setSelectedType(leaveType);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleEdit = (leaveType) => {
    router.push(`/hr/leave/types/edit/${leaveType.id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedType) return;
    
    setDeleting(true);
    try {
      await leaveTypeService.deleteLeaveType(selectedType.id);
      toast.success('Leave type deleted successfully');
      setLeaveTypes(prev => prev.filter(type => type.id !== selectedType.id));
      setShowDeleteConfirm(false);
      setShowDetail(false);
    } catch (error) {
      console.error('Error deleting leave type:', error);
      toast.error(error.message || 'Failed to delete leave type');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <Breadcrumb
          pages={[
            { name: 'HR', href: '/hr' },
            { name: 'Leave', href: '/hr/leave' },
            { name: 'Leave Types', href: '#' },
          ]}
          rightContent={
            <Link
              href="/hr/leave/types/add"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              <PlusCircle size={18} /> Add Leave Type
            </Link>
          }
        />
        
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      {/* Breadcrumb with Add Leave Type button */}
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Leave Types', href: '#' },
        ]}
        rightContent={
          <Link
            href="/hr/leave/types/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Leave Type
          </Link>
        }
      />

      {/* Header */}
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Types</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage different types of leave available to employees
        </p>
      </div>

      {/* Leave Types Grid */}
      {leaveTypes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Leave Types Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by creating your first leave type
          </p>
          <Link
            href="/hr/leave/types/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Leave Type
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaveTypes.map((leaveType) => (
            <div
              key={leaveType.id}
              onClick={() => handleCardClick(leaveType)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{leaveType.icon || '🏖️'}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {leaveType.name}
                  </h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  leaveType.isDeductible 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {leaveType.isDeductible ? 'Deductible' : 'Non-deductible'}
                </span>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  leaveType.isActive
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {leaveType.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{leaveType.limitDays || 0} days per year</span>
                </div>
                
                {leaveType.requiresAttachment && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Documentation required</span>
                  </div>
                )}
                
                {leaveType.isEncashable && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    <span>Encashment available</span>
                  </div>
                )}

                {!leaveType.requiresApproval && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Coins className="w-4 h-4 mr-2" />
                    <span>Auto-approved</span>
                  </div>
                )}
              </div>

              {/* View Details CTA */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Click to view details →
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave Type Detail Modal */}
      <LeaveTypeDetail
        isOpen={showDetail}
        onClose={closeDetail}
        leaveType={selectedType}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Leave Type"
        message={`Are you sure you want to delete the leave type "${selectedType?.name}"?`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        isDestructive={true}
        closeOnConfirm={false}
      />
    </div>
  );
}