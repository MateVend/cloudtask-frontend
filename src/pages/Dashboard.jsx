import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI } from '../services/api'

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState('week')

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const response = await dashboardAPI.getData()
            setData(response.data)
        } catch (error) {
            console.error('Failed to load dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    const stats = [
        {
            label: 'Total Projects',
            value: data?.stats.total_projects || 0,
            change: '+12%',
            changeType: 'increase',
            icon: '📁',
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
        },
        {
            label: 'Active Tasks',
            value: data?.stats.total_tasks - (data?.stats.completed_tasks || 0) || 0,
            change: '+5%',
            changeType: 'increase',
            icon: '✓',
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        },
        {
            label: 'Completed',
            value: data?.stats.completed_tasks || 0,
            change: '+23%',
            changeType: 'increase',
            icon: '✅',
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        },
        {
            label: 'Team Members',
            value: data?.stats.total_members || 0,
            change: '+2',
            changeType: 'increase',
            icon: '👥',
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
        },
    ]

    const statusColors = {
        todo: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', bar: 'bg-gray-500 dark:bg-gray-400' },
        in_progress: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', bar: 'bg-blue-500 dark:bg-blue-400' },
        review: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', bar: 'bg-purple-500 dark:bg-purple-400' },
        completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', bar: 'bg-green-500 dark:bg-green-400' },
    }

    const priorityColors = {
        low: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', bar: 'bg-gray-500 dark:bg-gray-400' },
        medium: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', bar: 'bg-blue-500 dark:bg-blue-400' },
        high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', bar: 'bg-orange-500 dark:bg-orange-400' },
        urgent: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', bar: 'bg-red-500 dark:bg-red-400' },
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
                        <p className="text-purple-100 dark:text-purple-200 text-lg">Here's what's happening with your projects today.</p>
                    </div>
                    <div className="hidden lg:block">
                        <div className="flex space-x-2">
                            {['week', 'month', 'year'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        timeRange === range
                                            ? 'bg-white text-purple-600'
                                            : 'bg-purple-500/50 dark:bg-purple-600/50 text-white hover:bg-purple-500 dark:hover:bg-purple-600'
                                    }`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-700"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <span className="text-3xl">{stat.icon}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    stat.changeType === 'increase' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.label}</div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks by Status */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl dark:shadow-gray-900/50 transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tasks Overview</h3>
                        <button className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:text-purple-700 dark:hover:text-purple-300">View All →</button>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(data?.tasks_by_status || {}).map(([status, count]) => {
                            const percentage = data?.stats.total_tasks ? (count / data.stats.total_tasks) * 100 : 0
                            const colors = statusColors[status]
                            return (
                                <div key={status} className="group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${colors.bg} ${colors.text}`}>
                                                {status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">{count} tasks</span>
                                        </div>
                                        <span className="text-gray-500 dark:text-gray-400 font-semibold">{percentage.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full ${colors.bar} group-hover:scale-105 transition-transform origin-left`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Tasks by Priority */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl dark:shadow-gray-900/50 transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Priority Distribution</h3>
                        <button className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:text-purple-700 dark:hover:text-purple-300">Filter →</button>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(data?.tasks_by_priority || {}).map(([priority, count]) => {
                            const percentage = data?.stats.total_tasks ? (count / data.stats.total_tasks) * 100 : 0
                            const colors = priorityColors[priority]
                            return (
                                <div key={priority} className="group cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${colors.bg} ${colors.text}`}>
                                                {priority.toUpperCase()}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">{count} tasks</span>
                                        </div>
                                        <span className="text-gray-500 dark:text-gray-400 font-semibold">{percentage.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full ${colors.bar} group-hover:scale-105 transition-transform origin-left`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Project Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl dark:shadow-gray-900/50 transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">📊 Active Projects Progress</h3>
                    <Link to="/projects" className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 flex items-center">
                        View All Projects →
                    </Link>
                </div>
                <div className="space-y-6">
                    {data?.project_progress?.slice(0, 5).map((project, index) => (
                        <div key={project.id} className="group cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                                        ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-orange-500 to-red-500', 'from-indigo-500 to-purple-500'][index % 5]
                                    } flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                                        {project.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {project.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {project.completed_tasks} of {project.total_tasks} tasks completed
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{project.progress}%</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                                <div
                                    className={`h-4 rounded-full bg-gradient-to-r ${
                                        ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-orange-500 to-red-500', 'from-indigo-500 to-purple-500'][index % 5]
                                    } group-hover:scale-105 transition-transform origin-left shadow-lg`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    {(!data?.project_progress || data.project_progress.length === 0) && (
                        <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-6xl mb-4">📁</div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No active projects yet</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first project to get started</p>
                            <Link to="/projects" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg">
                                <span className="mr-2">+</span> Create First Project
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Tasks */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl dark:shadow-gray-900/50 transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎯 My Tasks</h3>
                        <Link to="/tasks" className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {data?.my_tasks?.map((task, index) => (
                            <div key={task.id} className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 transition-all cursor-pointer group border border-gray-200 dark:border-gray-600">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="px-2 py-1 rounded bg-white dark:bg-gray-600 text-xs font-medium">{task.project.name}</span>
                                            {task.due_date && (
                                                <span className="flex items-center">
                                                    <span className="mr-1">📅</span>
                                                    {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${priorityColors[task.priority]?.bg} ${priorityColors[task.priority]?.text}`}>
                                        {task.priority.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!data?.my_tasks || data.my_tasks.length === 0) && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <div className="text-4xl mb-2">✓</div>
                                <p>All caught up! No pending tasks.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl dark:shadow-gray-900/50 transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">⚡ Recent Activity</h3>
                        <button className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300">Refresh</button>
                    </div>
                    <div className="space-y-4">
                        {data?.recent_tasks?.slice(0, 6).map((task, index) => (
                            <div key={task.id} className="flex items-start space-x-3 group cursor-pointer">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                                    ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500'][index % 3]
                                } flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform`}>
                                    {task.assigned_user?.name?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm">
                                        {task.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {task.project.name} • {task.assigned_user?.name || 'Unassigned'}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[task.status]?.bg} ${statusColors[task.status]?.text}`}>
                                    {task.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        ))}
                        {(!data?.recent_tasks || data.recent_tasks.length === 0) && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <div className="text-4xl mb-2">📋</div>
                                <p>No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}