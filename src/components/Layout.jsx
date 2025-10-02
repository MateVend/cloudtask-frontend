// FILE: src/components/Layout.jsx
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Layout() {
    const { user, organization, isAuthenticated, loading, logout, switchOrganization } = useApp()
    const location = useLocation()
    const navigate = useNavigate()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showOrgMenu, setShowOrgMenu] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Projects', path: '/projects', icon: '📁' },
        { name: 'Tasks', path: '/tasks', icon: '✓' },
        { name: 'Team', path: '/team', icon: '👥' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ]

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const handleSwitchOrg = async (orgId) => {
        await switchOrganization(orgId)
        setShowOrgMenu(false)
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 no-print">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            CloudTask Pro
                        </h1>
                    </div>

                    {/* Organization Selector */}
                    <div className="p-4 border-b border-gray-200 relative">
                        <button
                            onClick={() => setShowOrgMenu(!showOrgMenu)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                    {organization?.name?.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-sm">{organization?.name}</div>
                                    <div className="text-xs text-gray-500 capitalize">{organization?.plan} Plan</div>
                                </div>
                            </div>
                            <span className="text-gray-400">▼</span>
                        </button>

                        {showOrgMenu && (
                            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                {user?.organizations?.map((org) => (
                                    <button
                                        key={org.id}
                                        onClick={() => handleSwitchOrg(org.id)}
                                        className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                            org.id === organization?.id ? 'bg-purple-50' : ''
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                                            {org.name.charAt(0)}
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-medium text-sm">{org.name}</div>
                                            <div className="text-xs text-gray-500">{org.pivot.role}</div>
                                        </div>
                                        {org.id === organization?.id && (
                                            <span className="text-purple-600">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Menu */}
                    <div className="p-4 border-t border-gray-200 relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{user?.name}</div>
                                <div className="text-xs text-gray-500">{user?.email}</div>
                            </div>
                        </button>

                        {showUserMenu && (
                            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg text-red-600 font-medium"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 min-h-screen">
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}