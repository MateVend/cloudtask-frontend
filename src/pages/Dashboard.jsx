import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI } from '../services/api'

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    const stats = [
        {
            label: 'Total Projects',
            value: data?.stats.total_projects || 0,
            change: '+12%',
            icon: '📁',
            color: 'blue',
        },
        {
            label: 'Active Projects',
            value: data?.stats.active_projects || 0,
            change: '+5%',
            icon: '🎯',
            color: 'green',
        },
        {
            label: 'Total Tasks',
            value: data?.stats.total_tasks || 0,
            change: '+23%',
            icon: '✓',
            color: 'purple',
        },
        {
            label: 'Completed Tasks',
            value: data?.stats.completed_tasks || 0,
            change: '+18%',
            icon: '✅',
            color: 'emerald',
        },
    ]

    const statusColors = {
        todo: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-blue-100 text-blue-800',
        review: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
    }

    const priorityColors = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800',
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your projects.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                <p className="text-green-600 text-sm mt-2">{stat.change} from last month</p>
                            </div>
                            <div className="text-4xl">{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks by Status */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
                    <div className="space-y-3">
                        {Object.entries(data?.tasks_by_status || {}).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                    {status.replace('_', ' ').toUpperCase()}
                  </span>
                                    <span className="text-gray-600">{count} tasks</span>
                                </div>
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-purple-600 h-2 rounded-full"
                                        style={{ width: `${(count / data?.stats.total_tasks) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks by Priority */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
                    <div className="space-y-3">
                        {Object.entries(data?.tasks_by_priority || {}).map(([priority, count]) => (
                            <div key={priority} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
                    {priority.toUpperCase()}
                  </span>
                                    <span className="text-gray-600">{count} tasks</span>
                                </div>
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${(count / data?.stats.total_tasks) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Progress */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Active Projects Progress</h3>
                    <Link to="/projects" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        View All →
                    </Link>
                </div>
                <div className="space-y-4">
                    {data?.project_progress?.slice(0, 5).map((project) => (
                        <div key={project.id}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{project.name}</span>
                                <span className="text-sm text-gray-600">
                  {project.completed_tasks} / {project.total_tasks} tasks
                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    {(!data?.project_progress || data.project_progress.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                            <p className="mb-4">No active projects yet</p>
                            <Link to="/projects" className="btn btn-primary">
                                Create Your First Project
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* My Tasks & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Tasks */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">My Tasks</h3>
                        <Link to="/tasks" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {data?.my_tasks?.map((task) => (
                            <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{task.project.name}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                                </div>
                                {task.due_date && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        ))}
                        {(!data?.my_tasks || data.my_tasks.length === 0) && (
                            <p className="text-center py-8 text-gray-500">No pending tasks</p>
                        )}
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                    </div>
                    <div className="space-y-3">
                        {data?.recent_tasks?.slice(0, 5).map((task) => (
                            <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {task.project.name} • {task.assigned_user?.name || 'Unassigned'}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                  {task.status.replace('_', ' ')}
                </span>
                            </div>
                        ))}
                        {(!data?.recent_tasks || data.recent_tasks.length === 0) && (
                            <p className="text-center py-8 text-gray-500">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}