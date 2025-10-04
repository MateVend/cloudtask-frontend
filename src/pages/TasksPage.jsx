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

    const filteredTasks = useMemo(() => {
        let result = [...tasks]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query) ||
                    task.project?.name.toLowerCase().includes(query)
            )
        }

        if (filters.status) {
            result = result.filter((task) => task.status === filters.status)
        }

        if (filters.priority) {
            result = result.filter((task) => task.priority === filters.priority)
        }

        if (filters.project_id) {
            result = result.filter((task) => task.project_id === parseInt(filters.project_id))
        }

        if (filters.assigned_to) {
            result = result.filter((task) => task.assigned_to === parseInt(filters.assigned_to))
        }

        if (filters.overdue) {
            const now = new Date()
            result = result.filter(
                (task) =>
                    task.due_date &&
                    new Date(task.due_date) < now &&
                    task.status !== 'completed'
            )
        }

        result.sort((a, b) => {
            let aValue = a[sortBy]
            let bValue = b[sortBy]

            if (sortBy === 'project_name') {
                aValue = a.project?.name || ''
                bValue = b.project?.name || ''
            }
            if (sortBy === 'assigned_name') {
                aValue = a.assigned_user?.name || ''
                bValue = b.assigned_user?.name || ''
            }

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
        todo: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        review: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    }

    const priorityColors = {
        low: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
        urgent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 dark:border-purple-400 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage tasks across all projects</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleExportFiltered}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                        <span>📥</span>
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                        <span>🖨️</span>
                        <span>Print</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 no-print">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Search tasks by title, description, or project..."
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 no-print">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
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
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                        Clear all filters
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project</label>
                        <select
                            value={filters.project_id}
                            onChange={(e) => setFilters({ ...filters, project_id: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned To</label>
                        <select
                            value={filters.assigned_to}
                            onChange={(e) => setFilters({ ...filters, assigned_to: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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
                                className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overdue only</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between no-print">
                <p className="text-gray-600 dark:text-gray-400">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                </p>
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1"
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
                        className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('title')}
                                >
                                    Task {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('project_name')}
                                >
                                    Project {sortBy === 'project_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('assigned_name')}
                                >
                                    Assigned To {sortBy === 'assigned_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleSort('priority')}
                                >
                                    Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                <th
                                    className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
                                    <tr key={task.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                                                {task.description && (
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{task.description}</div>
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
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{task.project?.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {task.assigned_user ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                                                        {task.assigned_user.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{task.assigned_user.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 dark:text-gray-500">Unassigned</span>
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
                                                <span className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {isOverdue && '⚠️ '}
                                                    {new Date(task.due_date).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400 dark:text-gray-500">No due date</span>
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