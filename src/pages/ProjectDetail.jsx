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
        { id: 'todo', title: 'To Do', color: 'border-gray-300' },
        { id: 'in_progress', title: 'In Progress', color: 'border-blue-300' },
        { id: 'review', title: 'Review', color: 'border-purple-300' },
        { id: 'completed', title: 'Completed', color: 'border-green-300' },
    ]

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
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <Link to="/projects" className="text-gray-600 hover:text-gray-800">
                        ← Projects
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900">{project?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                            style={{ backgroundColor: project?.color }}
                        >
                            {project?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
                            <p className="text-gray-600 mt-1">{project?.description}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowTaskModal(true)} className="btn btn-primary">
                        + New Task
                    </button>
                </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="card">
                    <div className="text-sm text-gray-600">Total Tasks</div>
                    <div className="text-2xl font-bold mt-1">{tasks.length}</div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-600">Completed</div>
                    <div className="text-2xl font-bold mt-1 text-green-600">
                        {tasks.filter((t) => t.status === 'completed').length}
                    </div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-600">In Progress</div>
                    <div className="text-2xl font-bold mt-1 text-blue-600">
                        {tasks.filter((t) => t.status === 'in_progress').length}
                    </div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className="text-2xl font-bold mt-1 text-purple-600">{project?.progress}%</div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-4 gap-4">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className={`kanban-column border-t-4 ${column.color}`}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(column.id)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">{column.title}</h3>
                            <span className="text-sm text-gray-500">
                {tasks.filter((t) => t.status === column.id).length}
              </span>
                        </div>

                        <div className="space-y-3">
                            {tasks
                                .filter((task) => task.status === column.id)
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={() => handleDragStart(task)}
                                        className="task-card group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-gray-900 flex-1 pr-2">{task.title}</h4>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {task.description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                                        )}

                                        <div className="flex items-center justify-between">
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
                                            <div className="mt-2 text-xs text-gray-500">
                                                📅 {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Task Modal */}
            {showTaskModal && (
                <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold">Create New Task</h2>
                        </div>

                        <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                            <div>
                                <label className="label">Task Title</label>
                                <input
                                    type="text"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    className="input"
                                    placeholder="What needs to be done?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Description</label>
                                <textarea
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    className="input"
                                    rows="3"
                                    placeholder="Add more details..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Priority</label>
                                    <select
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                        className="input"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Status</label>
                                    <select
                                        value={taskForm.status}
                                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                                        className="input"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Assign To</label>
                                    <select
                                        value={taskForm.assigned_to}
                                        onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                                        className="input"
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
                                    <label className="label">Due Date</label>
                                    <input
                                        type="date"
                                        value={taskForm.due_date}
                                        onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Estimated Hours</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={taskForm.estimated_hours}
                                    onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: e.target.value })}
                                    className="input"
                                    placeholder="8"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
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