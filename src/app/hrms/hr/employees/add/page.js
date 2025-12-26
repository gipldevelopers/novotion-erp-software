"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import {
  User, Mail, Phone, MapPin, Briefcase, Calendar, Clock,
  Loader2, Edit, Trash2, FileText, CheckCircle, AlertCircle,
  Building, Shield, IndianRupee, Globe, Fingerprint
} from 'lucide-react';
import { employeeService } from '@/services/employeeService';
import { toast } from 'sonner';
import Button from '@/app/hrms/components/ui/button/Button';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id;

  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const data = await employeeService.getEmployeeById(employeeId);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error("Employee not found or failed to load");
        // router.push('/hrms/hr/employees');
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.deleteEmployee(employeeId);
        toast.success("Employee deleted successfully");
        router.push('/hrms/hr/employees');
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-gray-500 font-medium">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold">Employee Not Found</h2>
        <p className="text-gray-500">The employee record you are looking for does not exist.</p>
        <Button onClick={() => router.push('/hrms/hr/employees')}>
          Back to Staff List
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        title={`${employee.firstName} ${employee.lastName}`}
        subtitle={`Employee ID: ${employee.id}`}
        rightContent={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/hrms/hr/employees/${employeeId}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit size={16} /> Edit
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        }
      />

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden">
              {employee?.firstName?.charAt(0)}{employee?.lastName?.charAt(0)}
            </div>
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 ${employee.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{employee.designation}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={18} className="text-blue-500" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone size={18} className="text-green-500" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Building size={18} className="text-purple-500" />
                <span>{employee.department}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100 dark:border-blue-800">
                {employee.role}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${employee.status === 'Active'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600'
                }`}>
                {employee.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Join Date</p>
            <p className="font-bold">{employee.joinDate}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Security Role</p>
            <p className="font-bold">{employee.role}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Leave Requests</p>
            <p className="font-bold">0 Active</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Attendance</p>
            <p className="font-bold">98% Overall</p>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-50 dark:border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <section>
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Fingerprint size={20} className="text-blue-500" />
                      Identity & Personal Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <DetailItem label="Full Name" value={`${employee.firstName} ${employee.lastName}`} />
                      <DetailItem label="Email Address" value={employee.email} />
                      <DetailItem label="Phone Number" value={employee.phone} />
                      <DetailItem label="Employee ID" value={employee.id} />
                      <DetailItem label="Reporting Manager" value={employee.managerId || 'None'} />
                      <DetailItem label="Work Location" value="HQ - New York" />
                    </div>
                  </section>

                  <div className="h-px bg-gray-50 dark:bg-gray-700"></div>

                  <section>
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                      <MapPin size={20} className="text-green-500" />
                      Addresses
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs text-gray-400 font-black uppercase mb-2 tracking-widest">Permanent Address</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                          123 Green Valley St, Suite 400<br />
                          Sunnyvale, CA 94085<br />
                          United States
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-black uppercase mb-2 tracking-widest">Current Address</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                          Same as permanent address
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="space-y-8">
                  <section>
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                      <IndianRupee size={20} className="text-blue-500" />
                      Compensation & Contract
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                        <p className="text-sm font-bold text-blue-600 mb-1">Current Salary</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-1">
                          <IndianRupee size={24} /> 85,000 <span className="text-xs font-bold text-gray-400 uppercase">/ year</span>
                        </p>
                      </div>
                      <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-3xl border border-purple-100 dark:border-purple-800">
                        <p className="text-sm font-bold text-purple-600 mb-1">Employment Type</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Full Time</p>
                      </div>
                    </div>
                  </section>

                  <div className="h-px bg-gray-50 dark:bg-gray-700"></div>

                  <section>
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Briefcase size={20} className="text-indigo-500" />
                      Career History
                    </h4>
                    <div className="space-y-4">
                      <HistoryItem
                        title="Promotion to Senior Specialist"
                        date="Oct 2024"
                        description="Promoted due to exceptional performance in recruitment."
                      />
                      <HistoryItem
                        title="Probation Completion"
                        date="May 2024"
                        description="Successfully completed 3-month probation period."
                      />
                      <HistoryItem
                        title="Employee Onboarding"
                        date="Feb 2024"
                        description="Joined as HR Specialist."
                      />
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Verification Documents</h4>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/hrms/hr/employees/${employeeId}/documents`)}>
                      Manage Documents
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DocCard name="Pan Card" status="Verified" date="Feb 2024" />
                    <DocCard name="Aadhaar Card" status="Verified" date="Feb 2024" />
                    <DocCard name="Educational Certificates" status="Verified" date="Feb 2024" />
                    <DocCard name="Experience Letter" status="Pending" date="March 2024" isWarning />
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="space-y-6 text-center py-12">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-12 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 inline-block w-full">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Detailed attendance logs are coming soon to this portal.</p>
                    <p className="text-xs text-gray-400 mt-2 italic">Scheduled for next sprint update.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <Globe size={18} className="text-blue-500" />
              Work Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-700">
                <span className="text-sm text-gray-500 font-medium">Shift</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">General (9AM - 6PM)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-700">
                <span className="text-sm text-gray-500 font-medium">Time Zone</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">IST (GMT +5:30)</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500 font-medium">Lunch Break</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">1:00 PM - 2:00 PM</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle size={18} />
              HR Compliance
            </h3>
            <p className="text-sm text-blue-100 mb-6 leading-relaxed">
              This record is currently compliant with company policies and local labor regulations.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>TAX DOCUMENTS VALID</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>KYC COMPLETED</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>BACKGROUND CHECK PASS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-gray-900 dark:text-white font-bold">{value}</p>
    </div>
  );
}

function HistoryItem({ title, date, description }) {
  return (
    <div className="relative pl-8 pb-6 border-l-2 border-gray-100 dark:border-gray-700 last:pb-0">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500"></div>
      <div className="flex items-center gap-3 mb-1">
        <h5 className="font-bold text-gray-900 dark:text-white">{title}</h5>
        <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 uppercase">{date}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

function DocCard({ name, status, date, isWarning }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isWarning ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
          <FileText size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{name}</p>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Uploaded: {date}</p>
        </div>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${isWarning ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
        {status}
      </span>
    </div>
  );
}