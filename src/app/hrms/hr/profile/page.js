// src/app/(dashboard)/hr/profile/page.js
"use client";
import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';

import { Clock, Mail, Phone, MapPin } from "lucide-react";


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    // Mock profile data
    personal: {
      firstName: 'Lori',
      lastName: 'Broaddus',
      email: 'broaddus@example.com',
      phone: '(168) 8392 823',
      dateOfBirth: '1985-05-15',
      gender: 'Female',
      address: '123 Main Street, New York, NY 10001',
      emergencyContact: {
        name: 'John Broaddus',
        relationship: 'Spouse',
        phone: '(168) 8392 824'
      }
    },
    employment: {
      employeeId: 'Emp-010',
      designation: 'Finance Manager',
      department: 'Finance',
      joiningDate: '2022-01-15',
      employmentType: 'Full-time',
      workLocation: 'New York Office',
      manager: 'Sarah Johnson (HR Director)'
    },
    bank: {
      bankName: 'City Bank',
      accountNumber: 'XXXX-XXXX-XXXX-1234',
      accountType: 'Checking',
      routingNumber: '021000021',
      taxId: '123-45-6789'
    },
    documents: [
      { id: 1, name: 'Employment Contract', type: 'PDF', uploadDate: '2022-01-15' },
      { id: 2, name: 'ID Verification', type: 'PDF', uploadDate: '2022-01-20' },
      { id: 3, name: 'Tax Forms', type: 'PDF', uploadDate: '2022-02-10' }
    ],
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      twoFactorAuth: true,
      language: 'English',
      timezone: 'EST (Eastern Standard Time)'
    }
  });

  const handleUpdateProfile = (section, data) => {
    setProfileData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb 
        pageTitle="My Profile"
        rightContent={null}
      />

      {/* Profile Header */}
      <ProfileHeader profileData={profileData.personal} />

      {/* Profile Tabs */}
      <div className="mt-6">
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profileData={profileData}
          onUpdateProfile={handleUpdateProfile}
        />
      </div>
    </div>
  );
}