"use client";
import { useState, useEffect } from "react";
import {
    TrendingUp,
    TrendingDown,
    Target,
    Award,
    BarChart3,
    Activity,
    Zap,
    Users,
    Clock,
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

// Mock KPI data
const kpiData = [
    {
        id: 1,
        name: "Productivity Score",
        value: 87,
        target: 85,
        unit: "%",
        trend: "up",
        change: 5,
        category: "Performance",
        icon: Zap,
        color: "blue",
        description: "Overall productivity based on tasks completed and time management",
    },
    {
        id: 2,
        name: "Quality Score",
        value: 92,
        target: 90,
        unit: "%",
        trend: "up",
        change: 3,
        category: "Quality",
        icon: Award,
        color: "green",
        description: "Code quality, bug-free deployments, and review ratings",
    },
    {
        id: 3,
        name: "Task Completion Rate",
        value: 94,
        target: 95,
        unit: "%",
        trend: "down",
        change: -2,
        category: "Efficiency",
        icon: CheckCircle,
        color: "purple",
        description: "Percentage of tasks completed on time",
    },
    {
        id: 4,
        name: "Team Collaboration",
        value: 88,
        target: 85,
        unit: "%",
        trend: "up",
        change: 8,
        category: "Teamwork",
        icon: Users,
        color: "orange",
        description: "Participation in team activities and code reviews",
    },
    {
        id: 5,
        name: "Response Time",
        value: 2.3,
        target: 3.0,
        unit: "hrs",
        trend: "up",
        change: 15,
        category: "Efficiency",
        icon: Clock,
        color: "pink",
        description: "Average time to respond to requests and issues",
    },
    {
        id: 6,
        name: "Innovation Index",
        value: 78,
        target: 75,
        unit: "%",
        trend: "up",
        change: 4,
        category: "Innovation",
        icon: Activity,
        color: "teal",
        description: "New ideas implemented and process improvements suggested",
    },
];

const colorClasses = {
    blue: {
        bg: "bg-blue-500",
        light: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500 to-blue-600",
    },
    green: {
        bg: "bg-green-500",
        light: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
        gradient: "from-green-500 to-green-600",
    },
    purple: {
        bg: "bg-purple-500",
        light: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500 to-purple-600",
    },
    orange: {
        bg: "bg-orange-500",
        light: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-600 dark:text-orange-400",
        gradient: "from-orange-500 to-orange-600",
    },
    pink: {
        bg: "bg-pink-500",
        light: "bg-pink-100 dark:bg-pink-900/30",
        text: "text-pink-600 dark:text-pink-400",
        gradient: "from-pink-500 to-pink-600",
    },
    teal: {
        bg: "bg-teal-500",
        light: "bg-teal-100 dark:bg-teal-900/30",
        text: "text-teal-600 dark:text-teal-400",
        gradient: "from-teal-500 to-teal-600",
    },
};

// Animated Progress Bar Component
function AnimatedProgressBar({ value, target, color }) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const percentage = (value / target) * 100;
    const cappedPercentage = Math.min(percentage, 100);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedValue(cappedPercentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [cappedPercentage]);

    return (
        <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-3 ${colorClasses[color].bg} rounded-full transition-all duration-1000 ease-out relative`}
                    style={{ width: `${animatedValue}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>
            {/* Target marker */}
            <div
                className="absolute top-0 h-3 w-1 bg-gray-900 dark:bg-white"
                style={{ left: "100%" }}
            >
                <div className="absolute -top-1 -left-1 w-3 h-5 border-2 border-gray-900 dark:border-white rounded-sm"></div>
            </div>
        </div>
    );
}

// Radial Progress Component
function RadialProgress({ value, size = 100, strokeWidth = 8, color }) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (animatedValue / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedValue(value);
        }, 100);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${colorClasses[color].text} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {value}%
                </span>
            </div>
        </div>
    );
}

export default function KPIsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Calculate overall performance
    const overallScore =
        kpiData.reduce((sum, kpi) => {
            if (kpi.unit === "%") return sum + kpi.value;
            return sum;
        }, 0) / kpiData.filter((k) => k.unit === "%").length;

    const meetsTarget = kpiData.filter((kpi) => kpi.value >= kpi.target).length;
    const totalKPIs = kpiData.length;

    // Filter KPIs
    const categories = ["All", ...new Set(kpiData.map((k) => k.category))];
    const filteredKPIs =
        selectedCategory === "All"
            ? kpiData
            : kpiData.filter((k) => k.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Key Performance Indicators
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your performance metrics and achievements
                    </p>
                </div>

                {/* Overall Performance Banner */}
                <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl p-8 shadow-lg mb-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Overall Performance Score</h2>
                            <p className="text-blue-100 mb-4">
                                Excellent work! You're exceeding expectations in most areas.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-sm opacity-90 mb-1">KPIs Meeting Target</p>
                                    <p className="text-2xl font-bold">
                                        {meetsTarget}/{totalKPIs}
                                    </p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-sm opacity-90 mb-1">Success Rate</p>
                                    <p className="text-2xl font-bold">
                                        {Math.round((meetsTarget / totalKPIs) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <RadialProgress value={Math.round(overallScore)} size={140} color="blue" />
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Improving KPIs
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {kpiData.filter((k) => k.trend === "up").length}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <ArrowDownRight className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Needs Attention
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {kpiData.filter((k) => k.trend === "down").length}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Above Target
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {meetsTarget}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Avg Score
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {overallScore.toFixed(0)}%
                        </p>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredKPIs.map((kpi) => {
                        const Icon = kpi.icon;
                        const colors = colorClasses[kpi.color];

                        return (
                            <div
                                key={kpi.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 ${colors.light} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <Icon className={`w-6 h-6 ${colors.text}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {kpi.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {kpi.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 mb-1">
                                                {kpi.trend === "up" ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                                <span
                                                    className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-500" : "text-red-500"
                                                        }`}
                                                >
                                                    {kpi.change > 0 ? "+" : ""}
                                                    {kpi.change}%
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                vs last month
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    Current
                                                </p>
                                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                    {kpi.value}
                                                    <span className="text-lg ml-1">{kpi.unit}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    Target
                                                </p>
                                                <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                                                    {kpi.target}
                                                    <span className="text-sm ml-1">{kpi.unit}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                <span className={`font-medium ${colors.text}`}>
                                                    {kpi.value >= kpi.target ? "Target Achieved! 🎉" : "In Progress"}
                                                </span>
                                            </div>
                                            <AnimatedProgressBar
                                                value={kpi.value}
                                                target={kpi.target}
                                                color={kpi.color}
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>0</span>
                                                <span>Target: {kpi.target}{kpi.unit}</span>
                                            </div>
                                        </div>

                                        {kpi.value >= kpi.target && (
                                            <div className={`${colors.light} rounded-lg p-3 flex items-center gap-2`}>
                                                <Award className={`w-5 h-5 ${colors.text}`} />
                                                <span className={`text-sm font-medium ${colors.text}`}>
                                                    Exceeding expectations!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
