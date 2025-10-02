import { useState, useEffect, useMemo } from 'react'
import { taskAPI, projectAPI } from '../services/api'
import SearchBar from '../components/SearchBar'
import { exportToCSV, prepareTasksForExport } from '../utils/export'

export default function TasksPage() {
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        project_id: '',
        assigned_to: '',
        overdue: false,
    })
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        loadTasks()
        loadProjects()
    }, [])

    const loadTasks = async () => {
        try {
            const response = await taskAPI.getAll()
            setTasks(response.data)
        } catch (error) {
            console.error('Failed to load tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadProjects = async () => {
        try {
            const response = await projectAPI.getAll()
            setProjects(response.data)
        } catch (error) {
            console.error('Failed to load projects:', error)
        }
    }

    // Filter and search tasks
    const filteredTasks = useMemo(() => {
        let result = [...tasks]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query) ||
                    task.project?.name.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (filters.status) {
            result = result.filter((task) => task.status === filters.status)
        }

        // Priority filter
        if (filters.priority) {
            result = result.filter((task) => task.priority === filters.priority)
        }

        // Project filter
        if (filters.project_id) {
            result = result.filter((task) => task.project_id === parseInt(filters.project_id))
        }

        // Assigned to filter
        if (filters.assigned_to) {
            result = result.filter((task) => task.assigned_to === parseInt(filters.assigned_to))
        }

        // Overdue filter
        if (filters.overdue) {
            const now = new Date()
            result = result.filter(
                (task) =>
                    task.due_date &&
                    new Date(task.due_date) < now &&
                    task.status !== 'completed'
            )
        }

        // Sorting
        result.sort((a, b) => {
            let aValue = a[sortBy]
            let bValue = b[sortBy]

            // Handle nested properties
            if (sortBy === 'project_name') {
                aValue = a.project?.name || ''
                bValue = b.project?.name || ''
            }
            if (sortBy === 'assigned_name') {
                aValue = a.assigned_user?.name || ''
                bValue = b.assigned_user?.name || ''
            }

            // Convert to comparable values
            if (aValue instanceof Date) aValue = aValue.getTime()
            if (bValue instanceof Date) bValue = bValue.getTime()
            if (typeof aValue === 'string') aValue = aValue.toLowerCase()
            if (typeof bValue === 'string') bValue = bValue.toLowerCase()

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
            }
        })

        return result
    }, [tasks, searchQuery, filters, sortBy, sortOrder])

    // Get unique assignees
    const assignees = useMemo(() => {
        const uniqueUsers = {}
        tasks.forEach((task) => {
            if (task.assigned_user) {
                uniqueUsers[task.assigned_user.id] = task.assigned_user
            }
        })
        return Object.values(uniqueUsers)
    }, [tasks])

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskAPI.update(taskId, { status: newStatus })
            loadTasks()
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('asc')
        }
    }

    // Add export functions:
    const handleExportCSV = () => {
        const exportData = prepareTasksForExport(filteredTasks)
        const filename = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`
        exportToCSV(exportData, filename)
    }

    const handleExportFiltered = () => {
        if (filteredTasks.length === 0) {
            alert('No tasks to export')
            return
        }
        handleExportCSV()
    }

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
                    <p className="text-gray-600 mt-2">View and manage tasks across all projects</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleExportFiltered}
                        className="btn btn-secondary flex items-center space-x-2"
                    >
                        <span>📥</span>
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="btn btn-secondary flex items-center space-x-2"
                    >
                        <span>🖨️</span>
                        <span>Print</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card no-print">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Search tasks by title, description, or project..."
                />
            </div>

            {/* Filters */}
            <div className="card no-print">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filters</h3>
                    <button
                        onClick={() => {
                            setFilters({
                                status: '',
                                priority: '',
                                project_id: '',
                                assigned_to: '',
                                overdue: false,
                            })
                            setSearchQuery('')
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700"
                    >
                        Clear all filters
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="label">Project</label>
                        <select
                            value={filters.project_id}
                            onChange={(e) => setFilters({ ...filters, project_id: e.target.value })}
                            className="input"
                        >
                            <option value="">All Projects</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="input"
                        >
                            <option value="">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Priority</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            className="input"
                        >
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <label className="label">Assigned To</label>
                        <select
                            value={filters.assigned_to}
                            onChange={(e) => setFilters({ ...filters, assigned_to: e.target.value })}
                            className="input"
                        >
                            <option value="">All Users</option>
                            {assignees.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.overdue}
                                onChange={(e) => setFilters({ ...filters, overdue: e.target.checked })}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Overdue only</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between no-print">
                <p className="text-gray-600">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                </p>
                <div className="flex items-center space-x-2 no-print">
                    <label className="text-sm text-gray-600">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="created_at">Created Date</option>
                        <option value="due_date">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="status">Status</option>
                        <option value="title">Title</option>
                        <option value="project_name">Project</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {/* Tasks List */}
            <div className="card">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('title')}
                                >
                                    Task {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('project_name')}
                                >
                                    Project {sortBy === 'project_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('assigned_name')}
                                >
                                    Assigned To {sortBy === 'assigned_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('priority')}
                                >
                                    Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('due_date')}
                                >
                                    Due Date {sortBy === 'due_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTasks.map((task) => {
                                const isOverdue = task.due_date &&
                                    new Date(task.due_date) < new Date() &&
                                    task.status !== 'completed'

                                return (
                                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{task.title}</div>
                                                {task.description && (
                                                    <div className="text-sm text-gray-600 line-clamp-1">{task.description}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-semibold"
                                                    style={{ backgroundColor: task.project?.color }}
                                                >
                                                    {task.project?.name?.charAt(0)}
                                                </div>
                                                <span className="text-sm">{task.project?.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {task.assigned_user ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                                                        {task.assigned_user.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm">{task.assigned_user.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                          {task.priority.toUpperCase()}
                        </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]} border-none cursor-pointer`}
                                            >
                                                <option value="todo">TO DO</option>
                                                <option value="in_progress">IN PROGRESS</option>
                                                <option value="review">REVIEW</option>
                                                <option value="completed">COMPLETED</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-4">
                                            {task.due_date ? (
                                                <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {isOverdue && '⚠️ '}
                                                    {new Date(task.due_date).toLocaleDateString()}
                          </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">No due date</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}