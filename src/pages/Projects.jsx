import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectAPI } from '../services/api'

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [view, setView] = useState('grid')
    const [filter, setFilter] = useState('all')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#8b5cf6',
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
                color: '#8b5cf6',
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
        active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', gradient: 'from-green-500 to-emerald-600' },
        on_hold: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', gradient: 'from-yellow-500 to-orange-500' },
        completed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', gradient: 'from-blue-500 to-cyan-500' },
        archived: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', gradient: 'from-gray-400 to-gray-500' },
    }

    const colorOptions = [
        { value: '#8b5cf6', name: 'Purple', gradient: 'from-purple-500 to-indigo-600' },
        { value: '#3b82f6', name: 'Blue', gradient: 'from-blue-500 to-cyan-500' },
        { value: '#10b981', name: 'Green', gradient: 'from-green-500 to-emerald-600' },
        { value: '#f59e0b', name: 'Orange', gradient: 'from-orange-500 to-yellow-500' },
        { value: '#ef4444', name: 'Red', gradient: 'from-red-500 to-pink-500' },
        { value: '#ec4899', name: 'Pink', gradient: 'from-pink-500 to-rose-500' },
    ]

    const filteredProjects = projects.filter(p => {
        if (filter === 'all') return true
        return p.status === filter
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                        Projects
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage and track all your projects</p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Filter Tabs */}
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700">
                        {['all', 'active', 'completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md font-medium transition-all ${
                                    filter === f
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded ${view === 'grid' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                            <span className="text-xl">▦</span>
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded ${view === 'list' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                            <span className="text-xl">☰</span>
                        </button>
                    </div>

                    <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-xl transition-all">
                        + New Project
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-xl">
                    <div className="text-3xl font-bold">{projects.length}</div>
                    <div className="text-purple-100">Total Projects</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
                    <div className="text-3xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
                    <div className="text-green-100">Active</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-xl">
                    <div className="text-3xl font-bold">{projects.filter(p => p.status === 'completed').length}</div>
                    <div className="text-blue-100">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-6 text-white shadow-xl">
                    <div className="text-3xl font-bold">
                        {Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / (projects.length || 1))}%
                    </div>
                    <div className="text-orange-100">Avg Progress</div>
                </div>
            </div>

            {/* Projects Grid/List */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {filter !== 'all'
                            ? `No ${filter} projects found. Try changing the filter.`
                            : 'Create your first project to get started'}
                    </p>
                    <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg">
                        <span className="mr-2">+</span> Create Project
                    </button>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group block"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transform hover:-translate-y-2">
                                {/* Project Header with Gradient */}
                                <div className={`p-6 bg-gradient-to-br ${colorOptions.find(c => c.value === project.color)?.gradient || 'from-purple-500 to-indigo-600'}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                                            {project.name.charAt(0)}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleDelete(project.id)
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-white/80 text-sm line-clamp-2">
                                        {project.description || 'No description'}
                                    </p>
                                </div>

                                {/* Project Body */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusColors[project.status].bg} ${statusColors[project.status].text}`}>
                                            {project.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span>✓</span>
                                            <span className="font-medium">{project.tasks_count || 0} tasks</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full bg-gradient-to-r ${colorOptions.find(c => c.value === project.color)?.gradient || 'from-purple-500 to-indigo-600'} transition-all`}
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Team Avatars */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {project.users?.slice(0, 4).map((user, idx) => (
                                                <div
                                                    key={user.id}
                                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
                                                    title={user.name}
                                                >
                                                    {user.name.charAt(0)}
                                                </div>
                                            ))}
                                            {project.users?.length > 4 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">
                                                    +{project.users.length - 4}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                            View →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold">Project</th>
                            <th className="text-left py-4 px-6 font-semibold">Status</th>
                            <th className="text-left py-4 px-6 font-semibold">Progress</th>
                            <th className="text-left py-4 px-6 font-semibold">Tasks</th>
                            <th className="text-left py-4 px-6 font-semibold">Team</th>
                            <th className="text-left py-4 px-6 font-semibold">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProjects.map((project) => (
                            <tr key={project.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                                <td className="py-4 px-6">
                                    <Link to={`/projects/${project.id}`} className="flex items-center space-x-3 group">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorOptions.find(c => c.value === project.color)?.gradient || 'from-purple-500 to-indigo-600'} flex items-center justify-center text-white font-bold shadow-lg`}>
                                            {project.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {project.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {project.description || 'No description'}
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusColors[project.status].bg} ${statusColors[project.status].text}`}>
                                        {project.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full bg-gradient-to-r ${colorOptions.find(c => c.value === project.color)?.gradient || 'from-purple-500 to-indigo-600'}`}
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{project.progress}%</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{project.tasks_count || 0}</span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex -space-x-2">
                                        {project.users?.slice(0, 3).map((user) => (
                                            <div key={user.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800" title={user.name}>
                                                {user.name.charAt(0)}
                                            </div>
                                        ))}
                                        {project.users?.length > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">
                                                +{project.users.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white rounded-t-2xl">
                            <h2 className="text-3xl font-bold">Create New Project</h2>
                            <p className="text-purple-100 mt-1">Start your next big thing</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    placeholder="My Awesome Project"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                                    rows="4"
                                    placeholder="What is this project about?"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Project Color</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: color.value })}
                                                className={`relative h-16 rounded-xl bg-gradient-to-br ${color.gradient} shadow-lg hover:scale-110 transition-transform ${
                                                    formData.color === color.value ? 'ring-4 ring-purple-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                                                }`}
                                            >
                                                {formData.color === color.value && (
                                                    <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    >
                                        <option value="active">Active</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-xl">
                                    <span className="mr-2">✨</span> Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}