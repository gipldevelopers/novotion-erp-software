// src/app/(dashboard)/hr/leave/components/LeaveRequestForm.js
"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Calendar, User, FileText, Paperclip, Download, Trash2, ArrowLeft, Users, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { leaveRequestService } from '@/services/leaveRequestService';
import { toast } from 'sonner';

const LeaveRequestForm = ({ isEditMode = false, initialData = null, onSave, onCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeName: '',
    leaveType: '',
    reason: '',
    days: 0,
    fromDate: '',
    toDate: '',
    startDateBreakdown: 'full_day',
    endDateBreakdown: 'full_day',
    status: 'pending',
    attachment: null,
    attachmentName: '',
    cc: [] 
  });

  const [calculatedDays, setCalculatedDays] = useState(0);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [isCcDropdownOpen, setIsCcDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);
  
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const fileInputRef = useRef(null);
  const ccDropdownRef = useRef(null);

  useEffect(() => {
    fetchLeaveTypes();
    fetchCcOptions();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Convert date format from "11 Oct, 2023" to "2023-10-11" for input fields
      const parseDate = (dateStr) => {
        const months = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
          'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        
        const parts = dateStr.split(' ');
        const day = parts[0];
        const month = months[parts[1]];
        const year = parts[2].replace(',', '');
        
        return `${year}-${month}-${day.padStart(2, '0')}`;
      };

      const formData = {
        employeeName: initialData.employeeName || '',
        leaveType: initialData.leaveType || '',
        reason: initialData.reason || '',
        days: initialData.days || 0,
        fromDate: parseDate(initialData.fromDate) || '',
        toDate: parseDate(initialData.toDate) || '',
        startDateBreakdown: initialData.startDateBreakdown || 'full_day',
        endDateBreakdown: initialData.endDateBreakdown || 'full_day',
        status: initialData.status || 'pending',
        attachment: null,
        attachmentName: initialData.attachmentName || '',
        cc: initialData.cc || []
      };

      setFormData(formData);
      
      // Set existing attachment if present
      if (initialData.attachment) {
        setExistingAttachment(initialData.attachment);
      }
      
      // Calculate initial days
      calculateDays(formData);
    }
  }, [initialData]);

  const fetchLeaveTypes = async () => {
    try {
      const response = await leaveRequestService.getLeaveTypesDropdown();
      setLeaveTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      toast.error('Failed to load leave types');
    }
  };

  const fetchCcOptions = async () => {
    // In a real app, you would fetch this from an API
    // For now, using mock data
    const mockCcOptions = [
      { id: 1, name: 'John Smith', role: 'HR Manager', email: 'john.smith@company.com' },
      { id: 2, name: 'Sarah Johnson', role: 'Department Head', email: 'sarah.j@company.com' },
      { id: 3, name: 'Michael Brown', role: 'CEO', email: 'michael.b@company.com' },
      { id: 4, name: 'Emily Davis', role: 'Team Lead', email: 'emily.d@company.com' },
      { id: 5, name: 'David Wilson', role: 'Operations Manager', email: 'david.w@company.com' },
      { id: 6, name: 'Jennifer Lee', role: 'HR Director', email: 'jennifer.l@company.com' },
      { id: 7, name: 'Robert Taylor', role: 'Project Manager', email: 'robert.t@company.com' },
      { id: 8, name: 'Maria Garcia', role: 'Department Manager', email: 'maria.g@company.com' }
    ];
    setCcOptions(mockCcOptions);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ccDropdownRef.current && !ccDropdownRef.current.contains(event.target)) {
        setIsCcDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered CC options based on search
  const filteredCcOptions = ccOptions.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle CC selection
  const handleCcSelect = (person) => {
    if (!formData.cc.some(p => p.id === person.id)) {
      setFormData(prev => ({
        ...prev,
        cc: [...prev.cc, person]
      }));
    }
    setSearchQuery('');
    setIsCcDropdownOpen(false);
  };

  // Remove CC person
  const removeCcPerson = (personId) => {
    setFormData(prev => ({
      ...prev,
      cc: prev.cc.filter(p => p.id !== personId)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);

    // Recalculate days if date or breakdown fields change
    if (name === 'fromDate' || name === 'toDate' || 
        name === 'startDateBreakdown' || name === 'endDateBreakdown') {
      calculateDays(updatedFormData);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 
                           'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX)');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        attachment: file,
        attachmentName: file.name
      }));
      
      // Clear existing attachment when new file is selected
      setExistingAttachment(null);
    }
  };

  const removeAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachment: null,
      attachmentName: ''
    }));
    setExistingAttachment(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const calculateDays = (data) => {
    if (!data.fromDate || !data.toDate) {
      setCalculatedDays(0);
      return;
    }

    const start = new Date(data.fromDate);
    const end = new Date(data.toDate);
    
    // If it's the same day, check breakdown to determine days
    if (start.toDateString() === end.toDateString()) {
      let dayCount = 0;
      
      if (data.startDateBreakdown === 'full_day') {
        dayCount = 1;
      } else {
        dayCount = 0.5;
      }
      
      setCalculatedDays(dayCount);
      return;
    }
    
    // Calculate full days between dates
    const diffTime = Math.abs(end - start);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Adjust for partial days at start and end
    if (data.startDateBreakdown !== 'full_day') {
      diffDays -= 0.5;
    }
    
    if (data.endDateBreakdown !== 'full_day') {
      diffDays -= 0.5;
    }
    
    if (!isNaN(diffDays)) {
      setCalculatedDays(diffDays);
      setFormData(prev => ({ ...prev, days: diffDays }));
    }
  };

  const handleBreakdownChange = (field, value) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(updatedFormData);
    calculateDays(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        days: calculatedDays,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        attachment: formData.attachment,
        cc: formData.cc
      };

      if (isEditMode) {
        await leaveRequestService.updateLeaveRequest(initialData.id, submitData);
        toast.success('Leave request updated successfully');
      } else {
        await leaveRequestService.createLeaveRequest(submitData);
        toast.success('Leave request submitted successfully');
      }

      router.push('/hr/leave/requests');
      router.refresh();
    } catch (error) {
      console.error('Error saving leave request:', error);
      toast.error(error.message || 'Failed to save leave request');
    } finally {
      setLoading(false);
    }
  };

  const openDatePicker = (ref) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Leave Request' : 'Add New Leave Request'}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Employee Name (Read-only in edit mode, editable in add mode) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employee Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {isEditMode ? (
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                readOnly
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed"
              />
            ) : (
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            )}
          </div>
          {isEditMode && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Employee name cannot be changed
            </p>
          )}
        </div>

        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Leave Type *
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Please provide a detailed reason for your leave request"
              required
            />
          </div>
        </div>

        {/* Date Range with Calendar Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date *
            </label>
            <div className="relative">
              <input
                ref={fromDateRef}
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-3 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <Calendar 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" 
                onClick={() => openDatePicker(fromDateRef)}
              />
            </div>
            
            {/* Start Date Breakdown */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date Breakdown
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'full_day', label: 'Full Day' },
                  { value: 'first_half', label: 'First Half' },
                  { value: 'second_half', label: 'Second Half' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="startDateBreakdown"
                      checked={formData.startDateBreakdown === option.value}
                      onChange={() => handleBreakdownChange('startDateBreakdown', option.value)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date *
            </label>
            <div className="relative">
              <input
                ref={toDateRef}
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={formData.fromDate || new Date().toISOString().split('T')[0]}
                className="w-full pl-3 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <Calendar 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" 
                onClick={() => openDatePicker(toDateRef)}
              />
            </div>
            
            {/* End Date Breakdown */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date Breakdown
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'full_day', label: 'Full Day' },
                  { value: 'first_half', label: 'First Half' },
                  { value: 'second_half', label: 'Second Half' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="endDateBreakdown"
                      checked={formData.endDateBreakdown === option.value}
                      onChange={() => handleBreakdownChange('endDateBreakdown', option.value)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Days Display */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Calculated Leave Days:
            </span>
            <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
              {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Based on selected dates and breakdown options
          </p>
        </div>

        {/* CC Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CC (Managers & Supervisors)
          </label>
          <div className="relative" ref={ccDropdownRef}>
            {/* Selected CC People */}
            {formData.cc.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.cc.map(person => (
                  <div
                    key={person.id}
                    className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{person.name}</span>
                    <button
                      type="button"
                      onClick={() => removeCcPerson(person.id)}
                      className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input and Dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search managers and supervisors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsCcDropdownOpen(true)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Dropdown */}
              {isCcDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCcOptions.length > 0 ? (
                    filteredCcOptions.map(person => (
                      <div
                        key={person.id}
                        onClick={() => handleCcSelect(person)}
                        className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {person.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {person.role} • {person.email}
                          </p>
                        </div>
                        {formData.cc.some(p => p.id === person.id) && (
                          <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      No matching people found
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select managers and supervisors to notify about this leave request
            </p>
          </div>
        </div>

        {/* Attachment Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attachment (Optional)
          </label>
          <div className="space-y-3">
            {/* File input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              className="hidden"
            />
            
            {/* Upload button */}
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Upload File
            </button>
            
            {/* File info and restrictions */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
            </p>
            
            {/* Display selected file or existing attachment */}
            {(formData.attachmentName || existingAttachment) && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  <Paperclip className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                    {formData.attachmentName || (existingAttachment && existingAttachment.name) || 'Attachment'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {existingAttachment && (
                    <button
                      type="button"
                      onClick={() => window.open(existingAttachment.url, '_blank')}
                      className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      title="Download attachment"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove attachment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status (only in edit mode) */}
        {isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditMode ? 'Update Leave Request' : 'Submit Leave Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;