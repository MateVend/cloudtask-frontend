import { useState, useEffect } from 'react'
import { teamAPI } from '../services/api'

export default function Team() {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'member',
    })

    useEffect(() => {
        loadTeam()
    }, [])

    const loadTeam = async () => {
        try {
            const response = await teamAPI.getAll()
            setMembers(response.data)
        } catch (error) {
            console.error('Failed to load team:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInvite = async (e) => {
        e.preventDefault()
        try {
            await teamAPI.invite(formData)
            setShowModal(false)
            setFormData({ name: '', email: '', role: 'member' })
            loadTeam()
        } catch (error) {
            console.error('Failed to invite member:', error)
            alert(error.response?.data?.message || 'Failed to invite member')
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await teamAPI.updateRole(userId, newRole)
            loadTeam()
        } catch (error) {
            console.error('Failed to update role:', error)
        }
    }

    const handleRemove = async (userId) => {
        if (!confirm('Are you sure you want to remove this member?')) return
        try {
            await teamAPI.remove(userId)
            loadTeam()
        } catch (error) {
            console.error('Failed to remove member:', error)
        }
    }

    const roleColors = {
        admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        manager: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        member: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                        Manage your team members and their roles
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-all text-sm sm:text-base whitespace-nowrap"
                >
                    + Invite Member
                </button>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {[
                    { label: 'Total Members', count: members.length, color: 'text-gray-900 dark:text-white' },
                    { label: 'Admins', count: members.filter((m) => m.role === 'admin').length, color: 'text-purple-600 dark:text-purple-400' },
                    { label: 'Managers', count: members.filter((m) => m.role === 'manager').length, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Members', count: members.filter((m) => m.role === 'member').length, color: 'text-green-600 dark:text-green-400' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {stat.label}
                        </div>
                        <div className={`text-2xl sm:text-3xl font-bold mt-2 ${stat.color}`}>{stat.count}</div>
                    </div>
                ))}
            </div>

            {/* Team Members List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-3 sm:space-y-4">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors gap-3"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-base sm:text-lg font-semibold shadow-lg flex-shrink-0">
                                    {member.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{member.name}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{member.email}</div>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span>📋 {member.assigned_tasks_count} assigned tasks</span>
                                        <span>✓ {member.completed_tasks_count} completed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                <select
                                    value={member.role}
                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                    className={`flex-1 sm:flex-initial px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${roleColors[member.role]} border-none cursor-pointer`}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="member">Member</option>
                                </select>
                                <button
                                    onClick={() => handleRemove(member.id)}
                                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Remove member"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invite Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Invite Team Member</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                                Send an invitation to join your organization
                            </p>
                        </div>

                        <form onSubmit={handleInvite} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Role
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm sm:text-base"
                                >
                                    <option value="member">Member</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Admins have full access, Managers can manage projects, Members can view and edit assigned tasks.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg text-sm sm:text-base"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
