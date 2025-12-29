// Updated: 2025-12-27
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { hrmsService } from '@/services/hrmsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Calendar, 
  FileDown, 
  MapPin, 
  Home, 
  Clock, 
  Smartphone, 
  Monitor,
  Settings,
  Filter,
  Users,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Eye,
  Edit,
  MoreVertical,
  Download,
  RefreshCw,
  Shield,
  Wifi,
  Map,
  Building,
  Coffee,
  Zap,
  Moon,
  Sun,
  Calculator,
  UserCheck,
  Clock4,
  Briefcase,
  Navigation
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdvancedAttendancePage() {
    // State Management
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shifts, setShifts] = useState([]);
    const [rosters, setRosters] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [geoFenceEnabled, setGeoFenceEnabled] = useState(true);
    const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0,
        early: 0,
        remote: 0,
        overtime: 0,
        totalHours: 0
    });
    
    // Rules Configuration
    const [lateArrivalRules, setLateArrivalRules] = useState({
        gracePeriod: 15, // minutes
        deductionAfter: 30, // minutes
        halfDayAfter: 120, // minutes
        autoDeduct: true,
        notifyManager: true
    });
    
    const [overtimeRules, setOvertimeRules] = useState({
        dailyThreshold: 9, // hours
        weeklyThreshold: 45, // hours
        rateMultiplier: 1.5,
        approvalRequired: true,
        autoCalculate: true
    });
    
    const [geoFenceRules, setGeoFenceRules] = useState({
        radius: 500, // meters
        officeLocation: { lat: 40.7128, lng: -74.0060 },
        allowRemoteCheckin: true,
        strictMode: false
    });
    
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date()
    });
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterWorkMode, setFilterWorkMode] = useState('all');
    const [filterShift, setFilterShift] = useState('all');
    
    // Fetch Data
    useEffect(() => {
        fetchAttendanceData();
        
        // Get user location for geo-fencing
        getUserLocation();
        
        // Set up auto-refresh every 5 minutes
        const refreshInterval = setInterval(fetchAttendanceData, 5 * 60 * 1000);
        
        return () => clearInterval(refreshInterval);
    }, []);

    // Calculate stats when attendance data changes
    useEffect(() => {
        if (attendance.length > 0) {
            calculateStatistics();
        }
    }, [attendance]);

    // Main data fetching function
    const fetchAttendanceData = async () => {
        setLoading(true);
        try {
            // Fetch all data in parallel
            const [attendanceData, employeesData] = await Promise.all([
                hrmsService.getAttendance(),
                hrmsService.getEmployees?.() || Promise.resolve([])
            ]);
            
            // Process attendance data with advanced calculations
            const processedAttendance = processAttendanceData(attendanceData);
            
            setAttendance(processedAttendance);
            setEmployees(employeesData);
            
            // Load demo shifts if API not available
            loadShiftsData();
            loadRostersData();
            
        } catch (error) {
            console.error('Failed to fetch data:', error);
            loadDemoData();
        } finally {
            setLoading(false);
        }
    };

    // Process attendance data with all calculations
    const processAttendanceData = (data) => {
        return data.map(record => {
            // Assign shift and calculate times
            const shift = getShiftForEmployee(record.employeeId);
            const calculated = calculateWorkDetails(record, shift);
            
            // Determine work mode
            const workMode = determineWorkMode(record, shift);
            
            // Calculate overtime details
            const overtimeDetails = calculateOvertimeDetails(record, shift);
            
            // Calculate late/early arrival
            const arrivalDetails = calculateArrivalDetails(record, shift);
            
            // Geo-fencing validation
            const geoValidation = validateGeoFencing(record);
            
            // IP validation
            const ipValidation = validateIPAddress(record);
            
            // Comprehensive record
            return {
                ...record,
                shift,
                workMode,
                ...calculated,
                ...overtimeDetails,
                ...arrivalDetails,
                ...geoValidation,
                ...ipValidation,
                deviceType: record.deviceType || 'web',
                isRemote: workMode.type === 'remote',
                status: getAttendanceStatus(record, arrivalDetails),
                efficiency: calculateEfficiency(record, calculated.totalHours, shift),
                notes: record.notes || ''
            };
        });
    };

    // Calculate detailed work hours
    const calculateWorkDetails = (record, shift) => {
        if (!record.checkIn || !record.checkOut) {
            return { totalHours: 0, breakHours: 0, netHours: 0 };
        }
        
        const checkIn = new Date(`2000-01-01T${record.checkIn}`);
        const checkOut = new Date(`2000-01-01T${record.checkOut}`);
        let totalMinutes = (checkOut - checkIn) / (1000 * 60);
        
        // Deduct break time (1 hour if work > 6 hours)
        const breakMinutes = totalMinutes > 360 ? 60 : 0;
        const netMinutes = totalMinutes - breakMinutes;
        
        return {
            totalHours: (totalMinutes / 60).toFixed(2),
            breakHours: (breakMinutes / 60).toFixed(2),
            netHours: (netMinutes / 60).toFixed(2),
            checkInTime: checkIn,
            checkOutTime: checkOut
        };
    };

    // Determine work mode with detailed classification
    const determineWorkMode = (record, shift) => {
        // Check if remote work was approved
        const isRemoteApproved = record.workFromHomeRequest?.approved || false;
        
        // Check if within office hours
        const isWithinOfficeHours = isWithinShiftHours(record, shift);
        
        // Check location
        const isInOffice = validateGeoFencing(record).isWithinGeoFence;
        
        if (isRemoteApproved && !isInOffice) {
            return { type: 'remote', subtype: 'approved', verified: true };
        } else if (!isInOffice && isWithinOfficeHours) {
            return { type: 'remote', subtype: 'unapproved', verified: false };
        } else if (isInOffice) {
            return { type: 'office', subtype: 'onsite', verified: true };
        }
        
        return { type: 'unknown', subtype: 'unknown', verified: false };
    };

    // Calculate overtime with detailed breakdown
    const calculateOvertimeDetails = (record, shift) => {
        const netHours = parseFloat(calculateWorkDetails(record, shift).netHours);
        const shiftHours = shift?.hours || 8;
        
        let overtime = 0;
        let overtimeType = 'none';
        let overtimeRate = overtimeRules.rateMultiplier;
        let overtimeAmount = 0;
        
        if (netHours > overtimeRules.dailyThreshold) {
            overtime = netHours - overtimeRules.dailyThreshold;
            overtimeType = netHours > 12 ? 'double' : 'single';
            overtimeRate = overtimeType === 'double' ? 2.0 : overtimeRules.rateMultiplier;
            overtimeAmount = overtime * overtimeRate * (record.hourlyRate || 25);
        }
        
        // Check weekly overtime
        const weeklyHours = calculateWeeklyHours(record.employeeId);
        const weeklyOvertime = weeklyHours > overtimeRules.weeklyThreshold ? 
            weeklyHours - overtimeRules.weeklyThreshold : 0;
        
        return {
            overtime: parseFloat(overtime.toFixed(2)),
            overtimeType,
            overtimeRate,
            overtimeAmount: parseFloat(overtimeAmount.toFixed(2)),
            weeklyOvertime: parseFloat(weeklyOvertime.toFixed(2)),
            requiresApproval: overtime > 0 && overtimeRules.approvalRequired,
            approved: record.overtimeApproved || false
        };
    };

    // Calculate arrival details with precision
    const calculateArrivalDetails = (record, shift) => {
        if (!record.checkIn || !shift?.startTime) {
            return { 
                isLate: false, 
                isEarly: false, 
                lateMinutes: 0, 
                earlyMinutes: 0,
                arrivalStatus: 'no_checkin'
            };
        }
        
        const checkIn = new Date(`2000-01-01T${record.checkIn}`);
        const shiftStart = new Date(`2000-01-01T${shift.startTime}`);
        const graceTime = new Date(shiftStart.getTime() + lateArrivalRules.gracePeriod * 60000);
        
        const minutesDifference = (checkIn - shiftStart) / (1000 * 60);
        
        let isLate = false;
        let isEarly = false;
        let lateMinutes = 0;
        let earlyMinutes = 0;
        let arrivalStatus = 'on_time';
        
        if (checkIn > graceTime) {
            isLate = true;
            lateMinutes = Math.round(minutesDifference - lateArrivalRules.gracePeriod);
            arrivalStatus = lateMinutes > lateArrivalRules.halfDayAfter ? 'half_day' : 'late';
        } else if (checkIn < shiftStart && minutesDifference < -5) {
            isEarly = true;
            earlyMinutes = Math.round(Math.abs(minutesDifference));
            arrivalStatus = 'early';
        }
        
        return {
            isLate,
            isEarly,
            lateMinutes,
            earlyMinutes,
            arrivalStatus,
            gracePeriodUsed: isLate ? lateArrivalRules.gracePeriod : 0
        };
    };

    // Validate geo-fencing with detailed tracking
    const validateGeoFencing = (record) => {
        if (!geoFenceEnabled || !record.coordinates) {
            return { 
                isWithinGeoFence: true, 
                distanceFromOffice: 0,
                locationVerified: false,
                locationAccuracy: 'N/A'
            };
        }
        
        const distance = calculateDistance(
            record.coordinates.lat,
            record.coordinates.lng,
            geoFenceRules.officeLocation.lat,
            geoFenceRules.officeLocation.lng
        );
        
        const isWithin = distance <= geoFenceRules.radius;
        
        return {
            isWithinGeoFence: isWithin,
            distanceFromOffice: parseFloat(distance.toFixed(2)),
            locationVerified: record.locationVerified || false,
            locationAccuracy: record.locationAccuracy || 'medium',
            violation: !isWithin && geoFenceRules.strictMode
        };
    };

    // Validate IP address
    const validateIPAddress = (record) => {
        if (!ipRestrictionEnabled || !record.ipAddress) {
            return { 
                isValidIP: true, 
                ipType: 'N/A',
                securityLevel: 'N/A'
            };
        }
        
        const isValid = /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(record.ipAddress);
        const ipType = isValid ? 'internal' : 'external';
        
        return {
            isValidIP: isValid,
            ipType,
            securityLevel: isValid ? 'high' : 'low',
            violation: !isValid && ipRestrictionEnabled
        };
    };

    // Calculate statistics
    const calculateStatistics = () => {
        const stats = {
            present: 0,
            absent: 0,
            late: 0,
            early: 0,
            remote: 0,
            overtime: 0,
            totalHours: 0,
            averageHours: 0,
            onTimePercentage: 0
        };
        
        attendance.forEach(record => {
            if (record.status === 'Present') stats.present++;
            if (record.status === 'Absent') stats.absent++;
            if (record.arrivalDetails?.isLate) stats.late++;
            if (record.arrivalDetails?.isEarly) stats.early++;
            if (record.isRemote) stats.remote++;
            if (record.overtimeDetails?.overtime > 0) stats.overtime++;
            
            const hours = parseFloat(record.calculated?.netHours || 0);
            stats.totalHours += hours;
        });
        
        stats.averageHours = attendance.length > 0 ? 
            (stats.totalHours / attendance.length).toFixed(2) : 0;
        
        stats.onTimePercentage = attendance.length > 0 ? 
            Math.round(((stats.present - stats.late) / attendance.length) * 100) : 0;
        
        setStats(stats);
    };

    // Filter attendance data
    const filteredAttendance = useMemo(() => {
        return attendance.filter(record => {
            // Search filter
            if (searchTerm && !record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            
            // Status filter
            if (filterStatus !== 'all' && record.status !== filterStatus) {
                return false;
            }
            
            // Work mode filter
            if (filterWorkMode !== 'all') {
                if (filterWorkMode === 'remote' && !record.isRemote) return false;
                if (filterWorkMode === 'office' && record.isRemote) return false;
            }
            
            // Shift filter
            if (filterShift !== 'all' && record.shift?.id !== filterShift) {
                return false;
            }
            
            return true;
        });
    }, [attendance, searchTerm, filterStatus, filterWorkMode, filterShift]);

    // Get overtime summary
    const overtimeSummary = useMemo(() => {
        const summary = {};
        
        filteredAttendance.forEach(record => {
            if (record.overtimeDetails?.overtime > 0) {
                const employeeId = record.employeeId;
                if (!summary[employeeId]) {
                    summary[employeeId] = {
                        employeeId,
                        totalOvertime: 0,
                        totalAmount: 0,
                        days: 0,
                        records: []
                    };
                }
                
                summary[employeeId].totalOvertime += record.overtimeDetails.overtime;
                summary[employeeId].totalAmount += record.overtimeDetails.overtimeAmount;
                summary[employeeId].days++;
                summary[employeeId].records.push(record);
            }
        });
        
        return Object.values(summary).sort((a, b) => b.totalOvertime - a.totalOvertime);
    }, [filteredAttendance]);

    // Get late arrivals summary
    const lateArrivalsSummary = useMemo(() => {
        const summary = {};
        
        filteredAttendance.forEach(record => {
            if (record.arrivalDetails?.isLate) {
                const employeeId = record.employeeId;
                if (!summary[employeeId]) {
                    summary[employeeId] = {
                        employeeId,
                        totalLateMinutes: 0,
                        lateDays: 0,
                        averageLate: 0,
                        records: []
                    };
                }
                
                summary[employeeId].totalLateMinutes += record.arrivalDetails.lateMinutes;
                summary[employeeId].lateDays++;
                summary[employeeId].averageLate = 
                    summary[employeeId].totalLateMinutes / summary[employeeId].lateDays;
                summary[employeeId].records.push(record);
            }
        });
        
        return Object.values(summary).sort((a, b) => b.totalLateMinutes - a.totalLateMinutes);
    }, [filteredAttendance]);

    // Get remote work summary
    const remoteWorkSummary = useMemo(() => {
        const summary = {};
        
        filteredAttendance.forEach(record => {
            if (record.isRemote) {
                const employeeId = record.employeeId;
                if (!summary[employeeId]) {
                    summary[employeeId] = {
                        employeeId,
                        remoteDays: 0,
                        approvedDays: 0,
                        unapprovedDays: 0,
                        records: []
                    };
                }
                
                summary[employeeId].remoteDays++;
                if (record.workMode?.verified) {
                    summary[employeeId].approvedDays++;
                } else {
                    summary[employeeId].unapprovedDays++;
                }
                summary[employeeId].records.push(record);
            }
        });
        
        return Object.values(summary).sort((a, b) => b.remoteDays - a.remoteDays);
    }, [filteredAttendance]);

    // Get user location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    };

    // Handle check-in
    const handleCheckIn = async (deviceType = 'web') => {
        try {
            // Get current location if geo-fencing enabled
            let location = null;
            if (geoFenceEnabled && deviceType === 'mobile') {
                location = await getCurrentLocation();
            }
            
            // Get IP address if IP restriction enabled
            let ipInfo = null;
            if (ipRestrictionEnabled && deviceType === 'web') {
                ipInfo = await getIPInfo();
            }
            
            const checkInData = {
                deviceType,
                timestamp: new Date().toISOString(),
                location: location || undefined,
                ipInfo: ipInfo || undefined,
                workMode: await determineCurrentWorkMode(location)
            };
            
            // Call check-in API
            if (hrmsService.checkIn) {
                await hrmsService.checkIn(checkInData);
            }
            
            alert(`Successfully checked in via ${deviceType}`);
            fetchAttendanceData(); // Refresh data
            
        } catch (error) {
            console.error('Check-in failed:', error);
            alert(`Check-in failed: ${error.message}`);
        }
    };

    // Export functions
    const exportToCSV = () => {
        // Implementation
    };

    const exportToPDF = () => {
        // Implementation
    };

    const exportReport = (type) => {
        // Implementation
    };

    // Helper functions
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;
        
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c; // Distance in meters
    };

    const calculateWeeklyHours = (employeeId) => {
        // Implementation
        return 0;
    };

    const getShiftForEmployee = (employeeId) => {
        // Implementation
        return shifts[0] || { id: 1, name: 'General Shift', startTime: '09:00', endTime: '17:00', hours: 8 };
    };

    const isWithinShiftHours = (record, shift) => {
        // Implementation
        return true;
    };

    const getAttendanceStatus = (record, arrivalDetails) => {
        // Implementation
        return record.status || 'Present';
    };

    const calculateEfficiency = (record, netHours, shift) => {
        // Implementation
        return 95;
    };

    const loadShiftsData = () => {
        const demoShifts = [
            { id: 1, name: 'Morning Shift', startTime: '08:00', endTime: '16:00', hours: 8, type: 'regular' },
            { id: 2, name: 'Day Shift', startTime: '09:00', endTime: '17:00', hours: 8, type: 'regular' },
            { id: 3, name: 'Evening Shift', startTime: '14:00', endTime: '22:00', hours: 8, type: 'regular' },
            { id: 4, name: 'Night Shift', startTime: '22:00', endTime: '06:00', hours: 8, type: 'night' },
            { id: 5, name: 'Flexible Shift', startTime: '10:00', endTime: '18:00', hours: 8, type: 'flexible' }
        ];
        setShifts(demoShifts);
    };

    const loadRostersData = () => {
        const demoRosters = [
            { id: 1, name: 'Weekday Roster', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], shiftId: 2 },
            { id: 2, name: 'Weekend Roster', days: ['Sat', 'Sun'], shiftId: 1 },
            { id: 3, name: 'Rotational Roster', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], shiftId: 3 }
        ];
        setRosters(demoRosters);
    };

    const loadDemoData = () => {
        // Load comprehensive demo data
        const demoAttendance = [
            {
                id: 1,
                employeeId: 'EMP001',
                employeeName: 'John Smith',
                date: '2024-01-15',
                checkIn: '08:45',
                checkOut: '18:30',
                hours: 9.5,
                status: 'Present',
                coordinates: { lat: 40.7129, lng: -74.0061 },
                ipAddress: '192.168.1.101',
                deviceType: 'mobile',
                notes: 'Worked on project planning',
                workFromHomeRequest: { approved: false },
                hourlyRate: 30
            },
            {
                id: 2,
                employeeId: 'EMP002',
                employeeName: 'Sarah Johnson',
                date: '2024-01-15',
                checkIn: '09:25',
                checkOut: '17:30',
                hours: 8,
                status: 'Present',
                coordinates: { lat: 40.7130, lng: -74.0062 },
                ipAddress: '192.168.1.102',
                deviceType: 'web',
                notes: 'Client meeting',
                workFromHomeRequest: { approved: true },
                hourlyRate: 35
            },
            {
                id: 3,
                employeeId: 'EMP003',
                employeeName: 'Michael Chen',
                date: '2024-01-15',
                checkIn: '08:30',
                checkOut: '20:00',
                hours: 11.5,
                status: 'Present',
                coordinates: { lat: 40.7128, lng: -74.0059 },
                ipAddress: '192.168.1.103',
                deviceType: 'mobile',
                notes: 'Overtime for project deadline',
                workFromHomeRequest: { approved: false },
                hourlyRate: 40
            },
            {
                id: 4,
                employeeId: 'EMP004',
                employeeName: 'Emma Wilson',
                date: '2024-01-15',
                checkIn: null,
                checkOut: null,
                hours: 0,
                status: 'Absent',
                coordinates: null,
                ipAddress: null,
                deviceType: null,
                notes: 'Sick leave',
                workFromHomeRequest: { approved: false },
                hourlyRate: 28
            },
            {
                id: 5,
                employeeId: 'EMP005',
                employeeName: 'David Brown',
                date: '2024-01-15',
                checkIn: '10:15',
                checkOut: '19:45',
                hours: 9.5,
                status: 'Present',
                coordinates: { lat: 40.7127, lng: -74.0063 },
                ipAddress: '203.0.113.5', // External IP
                deviceType: 'web',
                notes: 'Working from home',
                workFromHomeRequest: { approved: true },
                hourlyRate: 32
            }
        ];
        
        setAttendance(processAttendanceData(demoAttendance));
        loadShiftsData();
        loadRostersData();
    };

    const getCurrentLocation = async () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    };

    const getIPInfo = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return {
                ip: data.ip,
                timestamp: new Date().toISOString()
            };
        } catch {
            return { ip: 'unknown', timestamp: new Date().toISOString() };
        }
    };

    const determineCurrentWorkMode = async (location) => {
        if (!location) return 'office';
        
        const distance = calculateDistance(
            location.lat,
            location.lng,
            geoFenceRules.officeLocation.lat,
            geoFenceRules.officeLocation.lng
        );
        
        return distance <= geoFenceRules.radius ? 'office' : 'remote';
    };

    // Chart data for visualization
    const attendanceChartData = [
        { day: 'Mon', present: 85, late: 10, absent: 5 },
        { day: 'Tue', present: 88, late: 8, absent: 4 },
        { day: 'Wed', present: 82, late: 12, absent: 6 },
        { day: 'Thu', present: 90, late: 6, absent: 4 },
        { day: 'Fri', present: 87, late: 9, absent: 4 }
    ];

    const workModeData = [
        { name: 'Office', value: 65, color: '#3b82f6' },
        { name: 'Remote', value: 25, color: '#10b981' },
        { name: 'Hybrid', value: 10, color: '#f59e0b' }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="p-8 space-y-6">
            {/* Header with Quick Stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Advanced Attendance Management</h2>
                    <p className="text-muted-foreground">Real-time tracking, analytics, and compliance monitoring</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAttendanceData}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => exportToCSV()}>CSV Export</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportToPDF()}>PDF Report</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportReport('summary')}>Summary Report</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportReport('detailed')}>Detailed Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.present}/{attendance.length}</div>
                        <p className="text-xs text-muted-foreground">{stats.onTimePercentage}% on time</p>
                        <Progress value={stats.onTimePercentage} className="mt-2" />
                    </CardContent>
                </Card>
                
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
                        <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
                
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Remote Work</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.remote}</div>
                        <p className="text-xs text-muted-foreground">Employees working remotely</p>
                    </CardContent>
                </Card>
                
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.overtime}</div>
                        <p className="text-xs text-muted-foreground">Total overtime instances</p>
                    </CardContent>
                </Card>
                
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageHours}h</div>
                        <p className="text-xs text-muted-foreground">Per employee</p>
                    </CardContent>
                </Card>
                
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Geo Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">98%</div>
                        <p className="text-xs text-muted-foreground">Within geo-fence</p>
                    </CardContent>
                </Card>
                
                <Card className="col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">IP Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">100%</div>
                        <p className="text-xs text-muted-foreground">Secure check-ins</p>
                    </CardContent>
                </Card>
            </div>

            {/* Check-in Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Monitor className="mr-2 h-4 w-4" /> Web Check-in
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">IP Restriction</span>
                                <Switch checked={ipRestrictionEnabled} onCheckedChange={setIpRestrictionEnabled} />
                            </div>
                            <Button className="w-full" onClick={() => handleCheckIn('web')}>
                                Check-in via Web
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Smartphone className="mr-2 h-4 w-4" /> Mobile Check-in
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Geo-fencing</span>
                                <Switch checked={geoFenceEnabled} onCheckedChange={setGeoFenceEnabled} />
                            </div>
                            <Button className="w-full" onClick={() => handleCheckIn('mobile')}>
                                Check-in via Mobile
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Select value={filterWorkMode} onValueChange={setFilterWorkMode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Work Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Modes</SelectItem>
                                    <SelectItem value="office">Office Only</SelectItem>
                                    <SelectItem value="remote">Remote Only</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterShift} onValueChange={setFilterShift}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Shift Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Shifts</SelectItem>
                                    {shifts.map(shift => (
                                        <SelectItem key={shift.id} value={shift.id}>{shift.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="overtime">Overtime</TabsTrigger>
                    <TabsTrigger value="late">Late Arrivals</TabsTrigger>
                    <TabsTrigger value="remote">Remote Work</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Attendance Logs</CardTitle>
                                    <CardDescription>Detailed attendance records with advanced tracking</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-[250px]">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Search employee..." 
                                            className="pl-9"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Present">Present</SelectItem>
                                            <SelectItem value="Absent">Absent</SelectItem>
                                            <SelectItem value="Late">Late</SelectItem>
                                            <SelectItem value="Half Day">Half Day</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Shift</TableHead>
                                            <TableHead>Check-in</TableHead>
                                            <TableHead>Check-out</TableHead>
                                            <TableHead>Hours</TableHead>
                                            <TableHead>Overtime</TableHead>
                                            <TableHead>Arrival</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Device</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={12} className="text-center py-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground">Loading attendance data...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredAttendance.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={12} className="text-center py-8">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground">No attendance records found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredAttendance.map((record) => (
                                                <TableRow key={record.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{record.employeeId}</div>
                                                        <div className="text-xs text-muted-foreground">{record.employeeName}</div>
                                                    </TableCell>
                                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {record.shift?.name || 'N/A'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <span>{record.checkIn || '--:--'}</span>
                                                            {record.deviceType === 'mobile' && (
                                                                <Smartphone className="h-3 w-3 text-blue-500" />
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{record.checkOut || '--:--'}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{record.hours}h</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Net: {record.calculated?.netHours || 0}h
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {record.overtimeDetails?.overtime > 0 ? (
                                                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                                <Zap className="mr-1 h-3 w-3" />
                                                                +{record.overtimeDetails.overtime}h
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">--</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {record.arrivalDetails?.isLate ? (
                                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                                <Clock4 className="mr-1 h-3 w-3" />
                                                                +{record.arrivalDetails.lateMinutes}m
                                                            </Badge>
                                                        ) : record.arrivalDetails?.isEarly ? (
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                <TrendingUp className="mr-1 h-3 w-3" />
                                                                -{record.arrivalDetails.earlyMinutes}m
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                <Target className="mr-1 h-3 w-3" />
                                                                On Time
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            {record.isRemote ? (
                                                                <Home className="h-3 w-3 text-green-500" />
                                                            ) : (
                                                                <Building className="h-3 w-3 text-blue-500" />
                                                            )}
                                                            <span className="text-xs">
                                                                {record.isRemote ? 'Remote' : 'Office'}
                                                                {record.geoValidation?.violation && ' ⚠️'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="capitalize text-xs">
                                                            {record.deviceType}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={
                                                                record.status === 'Present' ? 'default' : 
                                                                record.status === 'Absent' ? 'destructive' : 
                                                                'secondary'
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {record.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Record
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>
                                                                    <Clock className="mr-2 h-4 w-4" />
                                                                    Adjust Hours
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Calculator className="mr-2 h-4 w-4" />
                                                                    Calculate Overtime
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Overtime Tab */}
                <TabsContent value="overtime">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overtime Management</CardTitle>
                            <CardDescription>Detailed overtime tracking and calculations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Total Overtime Hours</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-purple-600">
                                                {overtimeSummary.reduce((sum, emp) => sum + emp.totalOvertime, 0).toFixed(2)}h
                                            </div>
                                            <p className="text-xs text-muted-foreground">This period</p>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Overtime Cost</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-red-600">
                                                ${overtimeSummary.reduce((sum, emp) => sum + emp.totalAmount, 0).toFixed(2)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Additional payroll</p>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Employees with Overtime</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{overtimeSummary.length}</div>
                                            <p className="text-xs text-muted-foreground">Need approval</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>Total Overtime</TableHead>
                                                <TableHead>Overtime Days</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Rate</TableHead>
                                                <TableHead>Approval</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {overtimeSummary.map((summary) => (
                                                <TableRow key={summary.employeeId}>
                                                    <TableCell className="font-medium">{summary.employeeId}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-purple-600">
                                                            {summary.totalOvertime.toFixed(2)}h
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{summary.days} days</TableCell>
                                                    <TableCell>${summary.totalAmount.toFixed(2)}</TableCell>
                                                    <TableCell>{overtimeRules.rateMultiplier}x</TableCell>
                                                    <TableCell>
                                                        <Badge variant={summary.records[0]?.overtimeDetails?.approved ? "default" : "outline"}>
                                                            {summary.records[0]?.overtimeDetails?.approved ? "Approved" : "Pending"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">View Details</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Late Arrivals Tab */}
                <TabsContent value="late">
                    <Card>
                        <CardHeader>
                            <CardTitle>Late Arrival Tracking</CardTitle>
                            <CardDescription>Monitor and analyze late arrivals</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {lateArrivalsSummary.slice(0, 4).map((summary, index) => (
                                        <Card key={summary.employeeId}>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">{summary.employeeId}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-amber-600">
                                                    {summary.totalLateMinutes}m
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Avg: {summary.averageLate.toFixed(1)}m late
                                                </p>
                                                <Progress 
                                                    value={Math.min((summary.totalLateMinutes / 500) * 100, 100)} 
                                                    className="mt-2" 
                                                    indicatorClassName="bg-amber-500"
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>Total Late Minutes</TableHead>
                                                <TableHead>Late Days</TableHead>
                                                <TableHead>Average Late</TableHead>
                                                <TableHead>Trend</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {lateArrivalsSummary.map((summary) => (
                                                <TableRow key={summary.employeeId}>
                                                    <TableCell className="font-medium">{summary.employeeId}</TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-amber-600">
                                                            {summary.totalLateMinutes}m
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{summary.lateDays} days</TableCell>
                                                    <TableCell>{summary.averageLate.toFixed(1)}m</TableCell>
                                                    <TableCell>
                                                        {summary.averageLate > 30 ? (
                                                            <TrendingUp className="h-4 w-4 text-red-500" />
                                                        ) : summary.averageLate > 15 ? (
                                                            <TrendingUp className="h-4 w-4 text-amber-500" />
                                                        ) : (
                                                            <TrendingDown className="h-4 w-4 text-green-500" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">Send Warning</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Remote Work Tab */}
                <TabsContent value="remote">
                    <Card>
                        <CardHeader>
                            <CardTitle>Remote Work Tracking</CardTitle>
                            <CardDescription>Monitor work-from-home patterns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {remoteWorkSummary.slice(0, 3).map((summary) => (
                                        <Card key={summary.employeeId}>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">{summary.employeeId}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-green-600">
                                                    {summary.remoteDays} days
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{summary.approvedDays} approved</span>
                                                    <span>•</span>
                                                    <span>{summary.unapprovedDays} unapproved</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>Remote Days</TableHead>
                                                <TableHead>Approved</TableHead>
                                                <TableHead>Unapproved</TableHead>
                                                <TableHead>Compliance</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {remoteWorkSummary.map((summary) => (
                                                <TableRow key={summary.employeeId}>
                                                    <TableCell className="font-medium">{summary.employeeId}</TableCell>
                                                    <TableCell>{summary.remoteDays} days</TableCell>
                                                    <TableCell>
                                                        <Badge variant="default" className="text-xs">
                                                            {summary.approvedDays}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-xs">
                                                            {summary.unapprovedDays}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Progress 
                                                                value={(summary.approvedDays / summary.remoteDays) * 100} 
                                                                className="w-24"
                                                            />
                                                            <span className="ml-2 text-xs">
                                                                {summary.remoteDays > 0 ? 
                                                                    Math.round((summary.approvedDays / summary.remoteDays) * 100) : 0}%
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">Review</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={attendanceChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={2} />
                                            <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} />
                                            <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Work Mode Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={workModeData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {workModeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Rules Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>Rules Configuration</CardTitle>
                    <CardDescription>Configure attendance policies and rules</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center">
                                <Clock className="mr-2 h-4 w-4" /> Late Arrival Rules
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Grace Period (minutes)', key: 'gracePeriod', type: 'number' },
                                    { label: 'Deduction After (minutes)', key: 'deductionAfter', type: 'number' },
                                    { label: 'Half Day After (minutes)', key: 'halfDayAfter', type: 'number' }
                                ].map((rule) => (
                                    <div key={rule.key}>
                                        <Label htmlFor={rule.key}>{rule.label}</Label>
                                        <Input
                                            id={rule.key}
                                            type={rule.type}
                                            value={lateArrivalRules[rule.key]}
                                            onChange={(e) => setLateArrivalRules({
                                                ...lateArrivalRules,
                                                [rule.key]: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-semibold">Overtime Rules</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Daily Threshold (hours)', key: 'dailyThreshold', type: 'number', step: '0.5' },
                                    { label: 'Weekly Threshold (hours)', key: 'weeklyThreshold', type: 'number' },
                                    { label: 'Rate Multiplier', key: 'rateMultiplier', type: 'number', step: '0.1' }
                                ].map((rule) => (
                                    <div key={rule.key}>
                                        <Label htmlFor={rule.key}>{rule.label}</Label>
                                        <Input
                                            id={rule.key}
                                            type={rule.type}
                                            step={rule.step}
                                            value={overtimeRules[rule.key]}
                                            onChange={(e) => setOvertimeRules({
                                                ...overtimeRules,
                                                [rule.key]: parseFloat(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center">
                                <Map className="mr-2 h-4 w-4" /> Geo-fencing Rules
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="radius">Radius (meters)</Label>
                                    <Input
                                        id="radius"
                                        type="number"
                                        value={geoFenceRules.radius}
                                        onChange={(e) => setGeoFenceRules({
                                            ...geoFenceRules,
                                            radius: parseInt(e.target.value) || 500
                                        })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="strictMode">Strict Mode</Label>
                                    <Switch
                                        id="strictMode"
                                        checked={geoFenceRules.strictMode}
                                        onCheckedChange={(checked) => setGeoFenceRules({
                                            ...geoFenceRules,
                                            strictMode: checked
                                        })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="allowRemoteCheckin">Allow Remote Check-in</Label>
                                    <Switch
                                        id="allowRemoteCheckin"
                                        checked={geoFenceRules.allowRemoteCheckin}
                                        onCheckedChange={(checked) => setGeoFenceRules({
                                            ...geoFenceRules,
                                            allowRemoteCheckin: checked
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}