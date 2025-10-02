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
        admin: 'bg-purple-100 text-purple-800',
        manager: 'bg-blue-100 text-blue-800',
        member: 'bg-gray-100 text-gray-800',
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
                    <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                    <p className="text-gray-600 mt-2">Manage your team members and their roles</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    + Invite Member
                </button>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <div className="text-gray-600 text-sm">Total Members</div>
                    <div className="text-3xl font-bold mt-2">{members.length}</div>
                </div>
                <div className="card">
                    <div className="text-gray-600 text-sm">Admins</div>
                    <div className="text-3xl font-bold mt-2 text-purple-600">
                        {members.filter((m) => m.role === 'admin').length}
                    </div>
                </div>
                <div className="card">
                    <div className="text-gray-600 text-sm">Managers</div>
                    <div className="text-3xl font-bold mt-2 text-blue-600">
                        {members.filter((m) => m.role === 'manager').length}
                    </div>
                </div>
                <div className="card">
                    <div className="text-gray-600 text-sm">Members</div>
                    <div className="text-3xl font-bold mt-2 text-green-600">
                        {members.filter((m) => m.role === 'member').length}
                    </div>
                </div>
            </div>

            {/* Team Members List */}
            <div className="card">
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{member.name}</div>
                                    <div className="text-sm text-gray-600">{member.email}</div>
                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                        <span>📋 {member.assigned_tasks_count} assigned tasks</span>
                                        <span>✓ {member.completed_tasks_count} completed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <select
                                    value={member.role}
                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[member.role]} border-none cursor-pointer`}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="member">Member</option>
                                </select>
                                <button
                                    onClick={() => handleRemove(member.id)}
                                    className="text-red-500 hover:text-red-700 p-2"
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
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold">Invite Team Member</h2>
                        </div>

                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input"
                                >
                                    <option value="member">Member</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Admins have full access, Managers can manage projects, Members can view and edit assigned tasks.
                                </p>
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