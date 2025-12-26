"use client";
import { useState, useEffect } from "react";
import {
    Target,
    TrendingUp,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    Plus,
    Filter,
    Award,
    Zap,
} from "lucide-react";

// Mock goals data
const goalsData = [
    {
        id: 1,
        title: "Complete React Advanced Course",
        description: "Finish the advanced React course and implement learnings in projects",
        category: "Learning & Development",
        priority: "High",
        progress: 75,
        startDate: "2024-01-01",
        dueDate: "2024-12-31",
        status: "In Progress",
        milestones: [
            { name: "Complete modules 1-5", completed: true },
            { name: "Build practice project", completed: true },
            { name: "Complete modules 6-10", completed: true },
            { name: "Final assessment", completed: false },
        ],
    },
    {
        id: 2,
        title: "Improve Code Review Quality",
        description: "Provide detailed and constructive code reviews for team members",
        category: "Team Collaboration",
        priority: "Medium",
        progress: 60,
        startDate: "2024-01-01",
        dueDate: "2024-12-31",
        status: "In Progress",
        milestones: [
            { name: "Review 50 PRs", completed: true },
            { name: "Review 100 PRs", completed: true },
            { name: "Review 150 PRs", completed: false },
            { name: "Review 200 PRs", completed: false },
        ],
    },
    {
        id: 3,
        title: "Launch New Feature Module",
        description: "Design, develop and deploy the new analytics dashboard",
        category: "Project Delivery",
        priority: "High",
        progress: 90,
        startDate: "2024-06-01",
        dueDate: "2024-12-31",
        status: "In Progress",
        milestones: [
            { name: "Requirements gathering", completed: true },
            { name: "Design mockups", completed: true },
            { name: "Development", completed: true },
            { name: "Testing & deployment", completed: false },
        ],
    },
    {
        id: 4,
        title: "Mentor Junior Developers",
        description: "Guide and mentor 2 junior developers on the team",
        category: "Leadership",
        priority: "Medium",
        progress: 45,
        startDate: "2024-03-01",
        dueDate: "2024-12-31",
        status: "In Progress",
        milestones: [
            { name: "Weekly 1-on-1 sessions", completed: true },
            { name: "Create learning roadmap", completed: true },
            { name: "Track progress monthly", completed: false },
            { name: "Final evaluation", completed: false },
        ],
    },
    {
        id: 5,
        title: "Reduce Bug Count by 30%",
        description: "Implement better testing practices to reduce production bugs",
        category: "Quality Improvement",
        priority: "High",
        progress: 100,
        startDate: "2024-01-01",
        dueDate: "2024-11-30",
        status: "Completed",
        milestones: [
            { name: "Set up unit tests", completed: true },
            { name: "Implement integration tests", completed: true },
            { name: "Add E2E tests", completed: true },
            { name: "Achieve 30% reduction", completed: true },
        ],
    },
];

const categoryColors = {
    "Learning & Development": "bg-blue-500",
    "Team Collaboration": "bg-green-500",
    "Project Delivery": "bg-purple-500",
    Leadership: "bg-orange-500",
    "Quality Improvement": "bg-pink-500",
};

const priorityColors = {
    High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

// Circular Progress Component
function CircularProgress({ progress, size = 120, strokeWidth = 8 }) {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (animatedProgress / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 100);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-blue-500 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {progress}%
                </span>
            </div>
        </div>
    );
}

export default function GoalsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    // Calculate stats
    const totalGoals = goalsData.length;
    const completedGoals = goalsData.filter((g) => g.status === "Completed").length;
    const inProgressGoals = goalsData.filter((g) => g.status === "In Progress").length;
    const averageProgress =
        goalsData.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals;

    // Filter goals
    const filteredGoals = goalsData.filter((goal) => {
        const matchesCategory =
            selectedCategory === "All" || goal.category === selectedCategory;
        const matchesStatus = selectedStatus === "All" || goal.status === selectedStatus;
        return matchesCategory && matchesStatus;
    });

    const categories = ["All", ...new Set(goalsData.map((g) => g.category))];
    const statuses = ["All", "In Progress", "Completed"];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Goals & Objectives
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track your performance goals and achievements
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        Add New Goal
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Total Goals
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {totalGoals}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {completedGoals}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    In Progress
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {inProgressGoals}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Avg Progress
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {averageProgress.toFixed(0)}%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overall Progress Visualization */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 shadow-lg mb-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                            <p className="text-blue-100 mb-4">
                                You're making great progress! Keep up the excellent work.
                            </p>
                            <div className="flex items-center gap-4">
                                <Award className="w-8 h-8" />
                                <div>
                                    <p className="text-sm opacity-90">Achievement Rate</p>
                                    <p className="text-xl font-semibold">
                                        {completedGoals} of {totalGoals} goals completed
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <CircularProgress progress={Math.round(averageProgress)} size={140} />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex flex-wrap gap-4 items-center">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Goals List */}
                <div className="space-y-6">
                    {filteredGoals.map((goal) => (
                        <div
                            key={goal.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className={`h-2 ${categoryColors[goal.category]}`}></div>
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Left: Goal Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    {goal.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    {goal.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                        {goal.category}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${priorityColors[goal.priority]
                                                            }`}
                                                    >
                                                        {goal.priority} Priority
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                                        <Calendar className="w-3 h-3" />
                                                        Due:{" "}
                                                        {new Date(goal.dueDate).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>

                                                {/* Milestones */}
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Milestones:
                                                    </p>
                                                    {goal.milestones.map((milestone, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            {milestone.completed ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            ) : (
                                                                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full flex-shrink-0" />
                                                            )}
                                                            <span
                                                                className={`text-sm ${milestone.completed
                                                                        ? "text-gray-500 dark:text-gray-400 line-through"
                                                                        : "text-gray-700 dark:text-gray-300"
                                                                    }`}
                                                            >
                                                                {milestone.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Progress Circle */}
                                    <div className="flex flex-col items-center justify-center lg:w-48">
                                        <CircularProgress progress={goal.progress} size={120} />
                                        <div className="mt-4 text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Progress
                                            </p>
                                            {goal.status === "Completed" ? (
                                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                    <Zap className="w-4 h-4" />
                                                    <span className="text-sm font-semibold">Completed!</span>
                                                </div>
                                            ) : (
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${goal.progress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredGoals.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No goals found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
