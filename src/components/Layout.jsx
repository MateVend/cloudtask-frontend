import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Layout() {
    const { user, organization, isAuthenticated, loading, logout, switchOrganization } = useApp()
    const location = useLocation()
    const navigate = useNavigate()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showOrgMenu, setShowOrgMenu] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your workspace...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
        { name: 'Projects', path: '/projects', icon: '📁', gradient: 'from-purple-500 to-pink-500' },
        { name: 'Tasks', path: '/tasks', icon: '✓', gradient: 'from-green-500 to-emerald-500' },
        { name: 'Team', path: '/team', icon: '👥', gradient: 'from-orange-500 to-red-500' },
        { name: 'Settings', path: '/settings', icon: '⚙️', gradient: 'from-gray-500 to-slate-500' },
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

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
                sidebarCollapsed ? 'w-20' : 'w-72'
            } bg-white border-r border-gray-200 shadow-xl`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">C</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        CloudTask
                                    </h1>
                                    <p className="text-xs text-gray-500">Pro Edition</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <span className="text-xl">{sidebarCollapsed ? '→' : '←'}</span>
                        </button>
                    </div>

                    {/* Organization Selector */}
                    <div className={`p-4 border-b border-gray-200 relative ${sidebarCollapsed ? 'px-2' : ''}`}>
                        <button
                            onClick={() => setShowOrgMenu(!showOrgMenu)}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all group"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow">
                                    {organization?.name?.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            {!sidebarCollapsed && (
                                <>
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold text-gray-900">{organization?.name}</div>
                                        <div className="text-xs text-gray-500 capitalize flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                                            {organization?.plan} Plan
                                        </div>
                                    </div>
                                    <span className="text-gray-400">▼</span>
                                </>
                            )}
                        </button>

                        {showOrgMenu && !sidebarCollapsed && (
                            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                                {user?.organizations?.map((org) => (
                                    <button
                                        key={org.id}
                                        onClick={() => handleSwitchOrg(org.id)}
                                        className={`w-full flex items-center space-x-3 p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all ${
                                            org.id === organization?.id ? 'bg-purple-50' : ''
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                                            {org.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-gray-900">{org.name}</div>
                                            <div className="text-xs text-gray-500">{org.pivot.role}</div>
                                        </div>
                                        {org.id === organization?.id && (
                                            <span className="text-purple-600 font-bold">✓</span>
                                        )}
                                    </button>
                                ))}
                                <div className="border-t border-gray-200 p-2">
                                    <button className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg font-medium">
                                        + Create Organization
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const active = isActive(item.path)
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        active
                                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                                            : 'text-gray-700 hover:bg-gray-100'
                                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                >
                  <span className={`text-2xl ${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                    {item.icon}
                  </span>
                                    {!sidebarCollapsed && (
                                        <span className="font-medium">{item.name}</span>
                                    )}
                                    {!sidebarCollapsed && active && (
                                        <span className="ml-auto">→</span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Quick Actions */}
                    {!sidebarCollapsed && (
                        <div className="p-4 border-t border-gray-200">
                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
                                <h4 className="font-semibold mb-2">🚀 Upgrade to Pro</h4>
                                <p className="text-sm text-purple-100 mb-3">Unlock unlimited projects and advanced features</p>
                                <Link to="/settings" className="block text-center bg-white text-purple-600 rounded-lg py-2 font-semibold hover:bg-gray-100 transition-colors">
                                    View Plans
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* User Menu */}
                    <div className={`p-4 border-t border-gray-200 relative ${sidebarCollapsed ? 'px-2' : ''}`}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            {!sidebarCollapsed && (
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-gray-900 text-sm">{user?.name}</div>
                                    <div className="text-xs text-gray-500">{user?.email}</div>
                                </div>
                            )}
                        </button>

                        {showUserMenu && (
                            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                                    <div className="font-semibold text-gray-900">{user?.name}</div>
                                    <div className="text-sm text-gray-600">{user?.email}</div>
                                </div>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <span className="mr-2">⚙️</span> Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium transition-colors"
                                >
                                    <span className="mr-2">🚪</span> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
                {/* Top Bar */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {navigation.find(n => isActive(n.path))?.name || 'Dashboard'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="relative hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Search projects, tasks..."
                                    className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <span className="text-2xl">🔔</span>
                                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                            </button>

                            {/* Quick Add */}
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                                + New
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-8 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}