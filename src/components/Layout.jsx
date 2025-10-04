import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { searchAPI, notificationAPI } from '../services/api'
import '../utils/date'
import pusher from '../services/pusher'
import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function Layout() {
    const { user, organization, isAuthenticated, loading, logout, switchOrganization } = useApp()
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showOrgMenu, setShowOrgMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showNewMenu, setShowNewMenu] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [showUpgradeCard, setShowUpgradeCard] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showSearchResults, setShowSearchResults] = useState(false)

    //Pusher
    useEffect(() => {
        if (!user) return

        const channel = pusher.subscribe(`user.${user.id}`)

        channel.bind('notification.new', (data) => {
            setNotifications(prev => [data.notification, ...prev])
            setUnreadCount(prev => prev + 1)
        })

        return () => {
            channel.unbind_all()
            pusher.unsubscribe(`user.${user.id}`)
        }
    }, [user])

    // Fetch notifications - replaced with real data
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchNotifications()
        fetchUnreadCount()

        // Poll every 30s for new unread count
        const interval = setInterval(() => {
            fetchUnreadCount()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const fetchNotifications = async () => {
        try {
            const response = await notificationAPI.getAll()
            setNotifications(response.data)
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        }
    }

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationAPI.getUnreadCount()
            setUnreadCount(response.data.count)
        } catch (error) {
            console.error('Failed to fetch unread count:', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead()
            setNotifications(notifications.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }


    useEffect(() => {
        const saved = localStorage.getItem('upgradeCardDismissed')
        if (saved === 'true') setShowUpgradeCard(false)
    }, [])

    useEffect(() => {
        const handleClick = () => {
            setShowUserMenu(false)
            setShowOrgMenu(false)
            setShowNotifications(false)
            setShowNewMenu(false)
            setShowSearchResults(false)
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    useEffect(() => {
        const searchData = async () => {
            if (searchQuery.length > 2) {
                try {
                    const response = await searchAPI.search(searchQuery)
                    setSearchResults(response.data)
                    setShowSearchResults(true)
                } catch (error) {
                    console.error('Search failed:', error)
                    setSearchResults([])
                }
            } else {
                setSearchResults([])
                setShowSearchResults(false)
            }
        }

        // debounce search
        const timer = setTimeout(() => {
            searchData()
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])


    const handleDismissUpgrade = () => {
        setShowUpgradeCard(false)
        localStorage.setItem('upgradeCardDismissed', 'true')
    }

    const handleSearch = (result) => {
        navigate(result.path)
        setSearchQuery('')
        setShowSearchResults(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900/20 transition-colors">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your workspace...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', badge: null },
        { name: 'Projects', path: '/projects', icon: '📁', badge: null },
        { name: 'Tasks', path: '/tasks', icon: '✓', badge: 12 },
        { name: 'Team', path: '/team', icon: '👥', badge: null },
        { name: 'Settings', path: '/settings', icon: '⚙️', badge: null },
    ]

    const quickActions = [
        { name: 'New Project', icon: '📁', action: () => navigate('/projects') },
        { name: 'New Task', icon: '✓', action: () => navigate('/tasks') },
        { name: 'Invite Member', icon: '👥', action: () => navigate('/team') },
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Professional Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 no-print ${
                sidebarCollapsed ? 'w-20' : 'w-80'
            } bg-white dark:bg-gray-800 shadow-2xl dark:shadow-gray-900/50`}>
                <div className="flex flex-col h-full">
                    {/* Logo & Toggle */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700">
                        {!sidebarCollapsed && (
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">C</span>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">CloudTask</h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Professional</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <span className="text-gray-600 dark:text-gray-400">{sidebarCollapsed ? '→' : '←'}</span>
                        </button>
                    </div>

                    {/* Organization Selector */}
                    {!sidebarCollapsed && (
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowOrgMenu(!showOrgMenu)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                                                {organization?.name?.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900 dark:text-white truncate">{organization?.name}</div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-block w-2 h-2 rounded-full ${
                                                    organization?.plan === 'free' ? 'bg-gray-400' :
                                                        organization?.plan === 'pro' ? 'bg-purple-500' :
                                                            'bg-indigo-600'
                                                }`}></span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{organization?.plan}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showOrgMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showOrgMenu && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                                        <div className="max-h-64 overflow-y-auto">
                                            {user?.organizations?.map((org) => (
                                                <button
                                                    key={org.id}
                                                    onClick={() => handleSwitchOrg(org.id)}
                                                    className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                        org.id === organization?.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                                                    }`}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                                        {org.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{org.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{org.pivot.role}</div>
                                                    </div>
                                                    {org.id === organization?.id && (
                                                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                                            <button className="w-full text-left px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg font-medium transition-colors">
                                                + Create Organization
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const active = isActive(item.path)
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                                        active
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                    title={sidebarCollapsed ? item.name : ''}
                                >
                                    <span className={`text-xl ${active ? '' : 'group-hover:scale-110'} transition-transform`}>
                                        {item.icon}
                                    </span>
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="font-medium flex-1">{item.name}</span>
                                            {item.badge && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    active ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {sidebarCollapsed && item.badge && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 dark:bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Upgrade Card */}
                    {!sidebarCollapsed && showUpgradeCard && organization?.plan === 'free' && (
                        <div className="p-4">
                            <div className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-xl overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                <button
                                    onClick={handleDismissUpgrade}
                                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                                >
                                    ×
                                </button>

                                <div className="relative">
                                    <div className="text-2xl mb-2">🚀</div>
                                    <h4 className="font-bold mb-1">Upgrade to Pro</h4>
                                    <p className="text-sm text-purple-100 mb-3">Get unlimited projects and advanced features</p>
                                    <Link to="/settings" className="block text-center bg-white text-purple-600 rounded-lg py-2 font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                                        View Plans
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Menu */}
                    <div className={`p-4 border-t border-gray-100 dark:border-gray-700 ${sidebarCollapsed ? 'px-2' : ''}`}>
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{user?.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
                                    </div>
                                )}
                            </button>

                            {showUserMenu && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                                        <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</div>
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Last active: Just now</div>
                                    </div>
                                    <Link
                                        to="/settings"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <span>⚙️</span>
                                        <span>Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium transition-colors"
                                    >
                                        <span>🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
                {/* Top Bar */}
                <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {navigation.find(n => isActive(n.path))?.name || 'Dashboard'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Search Bar */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search projects, tasks..."
                                        className="w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                        🔍
                                    </span>
                                </div>

                                {showSearchResults && searchResults.length > 0 && (
                                    <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2">Search Results</span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {searchResults.map((result, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSearch(result)}
                                                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <span className="text-2xl">
                                                        {result.type === 'project' ? '📁' : result.type === 'task' ? '✓' : '👤'}
                                                    </span>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{result.type}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <Sun className="w-5 h-5 text-yellow-400" />
                                )}
                            </button>

                            {/* Notifications */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="text-2xl">🔔</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                                        <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
                                            <h3 className="font-bold">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                                                            !notif.read ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                                                        }`}
                                                        onClick={async () => {
                                                            if (!notif.read) {
                                                                try {
                                                                    await notificationAPI.markAsRead(notif.id)
                                                                    setNotifications(notifications.map(n =>
                                                                        n.id === notif.id ? {...n, read: true} : n
                                                                    ))
                                                                    setUnreadCount(prev => Math.max(0, prev - 1))
                                                                } catch (error) {
                                                                    console.error('Failed to mark as read:', error)
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                        {notif.type === 'task_assigned' ? '📋' :
                            notif.type === 'comment_added' ? '💬' :
                                notif.type === 'task_completed' ? '✅' : '📌'}
                    </span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.message}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    {new Date(notif.created_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            {!notif.read && (
                                                                <div
                                                                    className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full flex-shrink-0 mt-2"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                    <div className="text-4xl mb-2">🔔</div>
                                                    <p>No notifications</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* New Button */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowNewMenu(!showNewMenu)}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
                                >
                                    <span>+ New</span>
                                </button>

                                {showNewMenu && (
                                    <div
                                        className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                                        {quickActions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    action.action()
                                                    setShowNewMenu(false)
                                                }}
                                                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                            >
                                                <span className="text-xl">{action.icon}</span>
                                                <span
                                                    className="text-gray-700 dark:text-gray-300 font-medium">{action.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}