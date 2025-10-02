import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectAPI } from '../services/api'

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3b82f6',
        start_date: '',
        end_date: '',
        status: 'active',
    })

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            const response = await projectAPI.getAll()
            setProjects(response.data)
        } catch (error) {
            console.error('Failed to load projects:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await projectAPI.create(formData)
            setShowModal(false)
            setFormData({
                name: '',
                description: '',
                color: '#3b82f6',
                start_date: '',
                end_date: '',
                status: 'active',
            })
            loadProjects()
        } catch (error) {
            console.error('Failed to create project:', error)
            alert(error.response?.data?.message || 'Failed to create project')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return

        try {
            await projectAPI.delete(id)
            loadProjects()
        } catch (error) {
            console.error('Failed to delete project:', error)
        }
    }

    const statusColors = {
        active: 'bg-green-100 text-green-800',
        on_hold: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
        archived: 'bg-gray-100 text-gray-800',
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-2">Manage and track all your projects</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    + New Project
                </button>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-6">Create your first project to get started</p>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="card hover:shadow-xl transition-all duration-200 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                                    style={{ backgroundColor: project.color }}
                                >
                                    {project.name.charAt(0)}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleDelete(project.id)
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                >
                                    🗑️
                                </button>
                            </div>

                            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {project.description || 'No description'}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
                                <span className="text-sm text-gray-600">{project.tasks_count || 0} tasks</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-semibold">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${project.progress}%`,
                                            backgroundColor: project.color,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Team Avatars */}
                            <div className="flex items-center space-x-2">
                                {project.users?.slice(0, 3).map((user, idx) => (
                                    <div
                                        key={user.id}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                                        style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
                                        title={user.name}
                                    >
                                        {user.name.charAt(0)}
                                    </div>
                                ))}
                                {project.users?.length > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 border-2 border-white -ml-2">
                                        +{project.users.length - 3}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold">Create New Project</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label">Project Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="My Awesome Project"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input"
                                    rows="3"
                                    placeholder="What is this project about?"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Color</label>
                                    <div className="flex space-x-2">
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color })}
                                                className={`w-10 h-10 rounded-lg ${
                                                    formData.color === color ? 'ring-2 ring-offset-2 ring-purple-600' : ''
                                                }`}
                                                style={{ backgroundColor: color }}
                                            ></button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input"
                                    >
                                        <option value="active">Active</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="label">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}