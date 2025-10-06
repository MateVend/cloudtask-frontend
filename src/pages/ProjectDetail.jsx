import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { projectAPI, taskAPI } from '../services/api'

export default function ProjectDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [draggedTask, setDraggedTask] = useState(null)
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        due_date: '',
        estimated_hours: '',
        status: 'todo',
    })

    useEffect(() => {
        loadProject()
        loadTasks()
    }, [id])

    const loadProject = async () => {
        try {
            const response = await projectAPI.getOne(id)
            setProject(response.data)
        } catch (error) {
            console.error('Failed to load project:', error)
        }
    }

    const loadTasks = async () => {
        try {
            const response = await taskAPI.getAll({ project_id: id })
            setTasks(response.data)
        } catch (error) {
            console.error('Failed to load tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTask = async (e) => {
        e.preventDefault()
        try {
            await taskAPI.create({ ...taskForm, project_id: id })
            setShowTaskModal(false)
            setTaskForm({
                title: '',
                description: '',
                priority: 'medium',
                assigned_to: '',
                due_date: '',
                estimated_hours: '',
                status: 'todo',
            })
            loadTasks()
        } catch (error) {
            console.error('Failed to create task:', error)
            alert(error.response?.data?.message || 'Failed to create task')
        }
    }

    const handleDeleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return
        try {
            await taskAPI.delete(taskId)
            loadTasks()
        } catch (error) {
            console.error('Failed to delete task:', error)
        }
    }

    const handleDragStart = (task) => {
        setDraggedTask(task)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = async (newStatus) => {
        if (!draggedTask) return

        try {
            await taskAPI.update(draggedTask.id, { status: newStatus })
            setDraggedTask(null)
            loadTasks()
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const columns = [
        { id: 'todo', title: 'To Do', color: 'border-gray-300 dark:border-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-700/30' },
        { id: 'in_progress', title: 'In Progress', color: 'border-blue-300 dark:border-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'review', title: 'Review', color: 'border-purple-300 dark:border-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        { id: 'completed', title: 'Completed', color: 'border-green-300 dark:border-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    ]

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
        <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
            {/* Header */}
            <div>
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                    <Link to="/projects" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        ← Projects
                    </Link>
                    <span className="text-gray-400 dark:text-gray-500">/</span>
                    <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium truncate">{project?.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-shrink-0"
                            style={{ backgroundColor: project?.color }}
                        >
                            {project?.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">{project?.name}</h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{project?.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-all text-sm sm:text-base whitespace-nowrap"
                    >
                        + New Task
                    </button>
                </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Tasks</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1 text-gray-900 dark:text-white">{tasks.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Completed</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                        {tasks.filter((t) => t.status === 'completed').length}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">In Progress</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                        {tasks.filter((t) => t.status === 'in_progress').length}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Progress</div>
                    <div className="text-xl sm:text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">{project?.progress}%</div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className={`bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 border-t-4 ${column.color} shadow-lg min-h-[300px] sm:min-h-[500px]`}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(column.id)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{column.title}</h3>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {tasks.filter((t) => t.status === column.id).length}
                            </span>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            {tasks
                                .filter((task) => task.status === column.id)
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={() => handleDragStart(task)}
                                        className="bg-white dark:bg-gray-700 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/50 transition-all cursor-move group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white flex-1 pr-2 break-words">{task.title}</h4>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-lg sm:text-xl leading-none flex-shrink-0"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {task.description && (
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                            {task.assigned_user && (
                                                <div
                                                    className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold"
                                                    title={task.assigned_user.name}
                                                >
                                                    {task.assigned_user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {task.due_date && (
                                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                📅 {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                ))}

                            {tasks.filter((t) => t.status === column.id).length === 0 && (
                                <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowTaskModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">Add a new task to {project?.name}</p>
                        </div>

                        <form onSubmit={handleCreateTask} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Title</label>
                                <input
                                    type="text"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    placeholder="What needs to be done?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none text-sm sm:text-base"
                                    rows="3"
                                    placeholder="Add more details..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                    <select
                                        value={taskForm.status}
                                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assign To</label>
                                    <select
                                        value={taskForm.assigned_to}
                                        onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    >
                                        <option value="">Unassigned</option>
                                        {project?.users?.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={taskForm.due_date}
                                        onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estimated Hours</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={taskForm.estimated_hours}
                                    onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    placeholder="8"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg text-sm sm:text-base">
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}