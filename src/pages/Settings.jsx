import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext' // Import theme hook
import { organizationAPI } from '../services/api'
import { paymentAPI } from '../services/api'
import { Moon, Sun, Upload, Check, AlertTriangle, Bell, Shield, Users, Mail, Globe, CreditCard, Download, Zap } from 'lucide-react'

export default function Settings() {
    const { organization, refreshUser, setOrganization } = useApp()
    const { theme, toggleTheme, setTheme } = useTheme() // Use theme context
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [usage, setUsage] = useState(null)
    const [activeTab, setActiveTab] = useState('general')
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [logoPreview, setLogoPreview] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: null
    })
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        securityAlerts: true,
        language: 'en',
        timezone: 'UTC'
    })

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name,
                description: organization.description || '',
                logo: organization.logo || null
            })
            setLogoPreview(organization.logo)
            loadUsage()
        }
    }, [organization])

    // Handle successful payment redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const success = urlParams.get("success")
        const canceled = urlParams.get("canceled")

        if (success === "true") {
            alert("🎉 Payment successful! Your plan has been upgraded.")
            paymentAPI.getSubscription().then((res) => {
                if (res.data && res.data.organization) {
                    if (typeof setOrganization === "function") {
                        setOrganization(res.data.organization)
                    }
                    refreshUser()
                }
            })
            window.history.replaceState({}, document.title, window.location.pathname)
        }

        if (canceled === "true") {
            alert("Payment was cancelled. Your plan has not changed.")
            window.history.replaceState({}, document.title, window.location.pathname)
        }
    }, [refreshUser])

    const loadUsage = async () => {
        try {
            const response = await organizationAPI.getUsage(organization.id)
            setUsage(response.data)
        } catch (error) {
            console.error('Failed to load usage:', error)
        }
    }

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB')
            return
        }

        if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
            alert('Only JPG, PNG, and SVG files are allowed')
            return
        }

        setUploadingLogo(true)
        try {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
            }
            reader.readAsDataURL(file)

            const formData = new FormData()
            formData.append('logo', file)
            const response = await organizationAPI.uploadLogo(organization.id, formData)

            setFormData(prev => ({ ...prev, logo: response.data.logoUrl }))
            await refreshUser()
            alert('Logo uploaded successfully!')
        } catch (error) {
            console.error('Failed to upload logo:', error)
            alert('Failed to upload logo. Please try again.')
            setLogoPreview(organization?.logo)
        } finally {
            setUploadingLogo(false)
        }
    }

    const handleUpdateOrg = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await organizationAPI.update(organization.id, {
                name: formData.name,
                description: formData.description
            })
            await refreshUser()
            alert('Organization updated successfully!')
        } catch (error) {
            console.error('Failed to update organization:', error)
            alert('Failed to update organization')
        } finally {
            setLoading(false)
        }
    }

    const handlePlanChange = async (newPlan) => {
        if (organization?.plan === newPlan) {
            alert('You are already on this plan')
            return
        }

        if (newPlan === 'free') {
            if (!confirm('Are you sure you want to downgrade to the free plan? This will take effect at the end of your billing period.')) {
                return
            }
            try {
                setLoading(true)
                await paymentAPI.cancelSubscription()
                alert('Your subscription will be cancelled at the end of the billing period.')
                await refreshUser()
            } catch (error) {
                console.error('Failed to cancel subscription:', error)
                alert('Failed to cancel subscription. Please try again.')
            } finally {
                setLoading(false)
            }
            return
        }

        const planNames = {
            pro: 'Pro ($29/month)',
            enterprise: 'Enterprise ($99/month)'
        }

        if (!confirm(`Upgrade to ${planNames[newPlan]}? You will be redirected to Stripe to complete payment.`)) {
            return
        }

        try {
            setLoading(true)
            const response = await paymentAPI.createCheckoutSession(newPlan)
            window.location.href = response.data.url
        } catch (error) {
            console.error('Failed to create checkout session:', error)
            alert(error.response?.data?.message || 'Failed to start checkout. Please try again.')
            setLoading(false)
        }
    }

    const handleDeleteOrg = async () => {
        const confirmation = prompt('Type "DELETE" to confirm deletion of this organization:')
        if (confirmation !== 'DELETE') return

        try {
            await organizationAPI.delete(organization.id)
            navigate('/dashboard')
            window.location.reload()
        } catch (error) {
            console.error('Failed to delete organization:', error)
            alert('Failed to delete organization')
        }
    }

    const plans = [
        {
            name: 'free',
            title: 'Free',
            price: '$0',
            description: 'Perfect for getting started',
            features: ['3 Projects', '5 Team Members', 'Basic Features', 'Community Support', '1GB Storage', 'Basic Analytics'],
        },
        {
            name: 'pro',
            title: 'Pro',
            price: '$29',
            description: 'For growing teams',
            features: ['50 Projects', '20 Team Members', 'All Features', 'Priority Support', '50GB Storage', 'Advanced Analytics', 'Custom Integrations', 'API Access'],
            popular: true,
        },
        {
            name: 'enterprise',
            title: 'Enterprise',
            price: '$99',
            description: 'For large organizations',
            features: ['Unlimited Projects', 'Unlimited Members', 'Advanced Features', 'Dedicated Support', 'Unlimited Storage', 'Advanced Security', 'SSO & SAML', 'Custom Contracts', 'SLA Guarantee'],
        },
    ]

    const tabs = [
        { id: 'general', label: 'General', icon: <Shield className="w-4 h-4" /> },
        { id: 'appearance', label: 'Appearance', icon: <Moon className="w-4 h-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'plan', label: 'Plan & Billing', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'usage', label: 'Usage', icon: <Zap className="w-4 h-4" /> },
        { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
        { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                Settings
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                                Manage your organization settings and preferences
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-6 h-6 text-purple-600" />
                            ) : (
                                <Sun className="w-6 h-6 text-yellow-400" />
                            )}
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-xl">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <div className="flex overflow-x-auto scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-shrink-0 px-6 py-4 font-medium transition-all flex items-center gap-2 ${
                                            activeTab === tab.id
                                                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                    >
                                        {tab.icon}
                                        <span className="whitespace-nowrap">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8">
                            {/* General Tab */}
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Organization Information
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Update your organization's public information
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                    Organization Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all"
                                                    placeholder="Acme Corporation"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                    Organization ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={organization?.id || ''}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all resize-none"
                                                rows="4"
                                                placeholder="Tell us about your organization and what you do..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                                Organization Logo
                                            </label>
                                            <div className="flex items-center space-x-6">
                                                <div className="relative group">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt="Organization logo"
                                                            className="w-28 h-28 rounded-2xl object-cover border-4 border-gray-200 dark:border-gray-700 shadow-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                                            {organization?.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                    {uploadingLogo && (
                                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        id="logo-upload"
                                                        accept="image/jpeg,image/png,image/svg+xml"
                                                        onChange={handleLogoUpload}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="logo-upload"
                                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl cursor-pointer transition-all shadow-lg hover:shadow-xl font-semibold"
                                                    >
                                                        <Upload className="w-5 h-5 mr-2" />
                                                        Upload New Logo
                                                    </label>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                                        JPG, PNG or SVG. Maximum file size 2MB.
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                        Recommended: Square image, at least 400x400px
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={handleUpdateOrg}
                                                disabled={loading}
                                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                                        Saving Changes...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-5 h-5 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Appearance Settings
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Customize how the application looks and feels
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => {
                                                setTheme('light')
                                                applyTheme('light')
                                            }}
                                            className={`group p-8 rounded-2xl border-3 transition-all duration-300 ${
                                                theme === 'light'
                                                    ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-xl scale-105'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-lg bg-white dark:bg-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg group-hover:scale-110 transition-transform">
                                                    <Sun className="w-10 h-10 text-white" />
                                                </div>
                                                {theme === 'light' && (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg animate-in">
                                                        <Check className="w-5 h-5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-2xl mb-2">
                                                Light Mode
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Bright and clean interface perfect for daytime use
                                            </p>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setTheme('dark')
                                                applyTheme('dark')
                                            }}
                                            className={`group p-8 rounded-2xl border-3 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-xl scale-105'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-lg bg-white dark:bg-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform">
                                                    <Moon className="w-10 h-10 text-white" />
                                                </div>
                                                {theme === 'dark' && (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg animate-in">
                                                        <Check className="w-5 h-5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-2xl mb-2">
                                                Dark Mode
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Easy on the eyes, perfect for night work and focus
                                            </p>
                                        </button>
                                    </div>

                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl">
                                        <div className="flex items-start gap-3">
                                            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                                    System-wide Theme
                                                </h4>
                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                    Your theme preference will be applied across all pages and saved to your browser.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Notification Preferences
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Control how and when you receive notifications
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your projects', icon: <Mail className="w-5 h-5" /> },
                                            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get browser notifications for important updates', icon: <Bell className="w-5 h-5" /> },
                                            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary of your organization activity', icon: <Download className="w-5 h-5" /> },
                                            { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security and account notifications', icon: <Shield className="w-5 h-5" /> },
                                        ].map((pref) => (
                                            <div key={pref.key} className="flex items-center justify-between p-6 bg-white dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                                        {pref.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                            {pref.label}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {pref.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setPreferences({ ...preferences, [pref.key]: !preferences[pref.key] })}
                                                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                                                        preferences[pref.key] ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                                            preferences[pref.key] ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Plan & Billing Tab */}
                            {activeTab === 'plan' && (
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wider">Current Plan</h3>
                                                <div className="text-4xl font-bold capitalize mb-1">{organization?.plan}</div>
                                                <p className="text-purple-100">Active since {new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm opacity-90 mb-2 uppercase tracking-wider">Monthly Cost</div>
                                                <div className="text-4xl font-bold">
                                                    {plans.find((p) => p.name === organization?.plan)?.price}
                                                </div>
                                                <p className="text-purple-100 mt-1">per month</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8">
                                        {plans.map((plan) => (
                                            <div
                                                key={plan.name}
                                                className={`relative overflow-visible rounded-2xl p-8 border-2 transition-all duration-300 ${
                                                    organization?.plan === plan.name
                                                        ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 shadow-2xl scale-105'
                                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-105'
                                                }`}
                                            >
                                                {plan.popular && (
                                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-6 py-2 rounded-full font-bold shadow-lg animate-pulse">
                                                            ⭐ MOST POPULAR
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-center mb-6">
                                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                                        {plan.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        {plan.description}
                                                    </p>
                                                </div>
                                                <div className="text-center mb-8">
                                                    <div className="text-5xl font-bold text-gray-900 dark:text-white">
                                                        {plan.price}
                                                    </div>
                                                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                                                </div>
                                                <ul className="space-y-4 mb-8">
                                                    {plan.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-start text-sm">
                                                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {organization?.plan === plan.name ? (
                                                    <button className="w-full py-4 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center">
                                                        <Check className="w-5 h-5 mr-2" />
                                                        Current Plan
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePlanChange(plan.name)}
                                                        disabled={loading}
                                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                                                    >
                                                        {loading ? 'Processing...' : organization?.plan === 'free' ? 'Upgrade Now' : 'Switch Plan'}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Usage Tab */}
                            {activeTab === 'usage' && usage && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            Resource Usage
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Monitor your organization's resource consumption
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <UsageCard
                                            label="Projects"
                                            used={usage.projects.used}
                                            limit={usage.projects.limit}
                                            color="purple"
                                            icon="📁"
                                        />
                                        <UsageCard
                                            label="Team Members"
                                            used={usage.users.used}
                                            limit={usage.users.limit}
                                            color="blue"
                                            icon="👥"
                                        />
                                        <UsageCard
                                            label="Storage"
                                            used={usage.storage.used}
                                            limit={usage.storage.limit}
                                            unit="MB"
                                            color="green"
                                            icon="💾"
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <UsageBar
                                            label="Projects"
                                            used={usage.projects.used}
                                            limit={usage.projects.limit}
                                            color="purple"
                                        />
                                        <UsageBar
                                            label="Team Members"
                                            used={usage.users.used}
                                            limit={usage.users.limit}
                                            color="blue"
                                        />
                                        <UsageBar
                                            label="Storage"
                                            used={usage.storage.used}
                                            limit={usage.storage.limit}
                                            unit="MB"
                                            color="green"
                                        />
                                    </div>

                                    {(usage.projects.used / usage.projects.limit > 0.8 || usage.users.used / usage.users.limit > 0.8) && (
                                        <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl shadow-lg">
                                            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-yellow-900 dark:text-yellow-200 font-bold text-lg mb-1">
                                                    Approaching Plan Limits
                                                </p>
                                                <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                                                    You're using over 80% of your available resources. Consider upgrading your plan to avoid service interruptions.
                                                </p>
                                                <button
                                                    onClick={() => setActiveTab('plan')}
                                                    className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
                                                >
                                                    View Plans
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Team Tab */}
                            {activeTab === 'team' && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                Team Management
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Manage team members and their permissions
                                            </p>
                                        </div>
                                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center">
                                            <Users className="w-5 h-5 mr-2" />
                                            Invite Members
                                        </button>
                                    </div>

                                    <div className="bg-white dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Active Members</h3>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {usage?.users.used || 0} / {usage?.users.limit || 5} members
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                                Team member list will appear here
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Danger Zone Tab */}
                            {activeTab === 'danger' && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-3">
                                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">
                                                Danger Zone
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Irreversible and destructive actions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-4 border-red-200 dark:border-red-900 rounded-2xl p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                                                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                                                    Delete Organization
                                                </h3>
                                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                    Once you delete your organization, there is no going back. This action will:
                                                </p>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                                    <li className="flex items-center">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                                        Permanently delete all projects and tasks
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                                        Remove all team members and their access
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                                        Delete all uploaded files and data
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                                        Cancel any active subscriptions
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDeleteOrg}
                                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                                        >
                                            <AlertTriangle className="w-5 h-5 mr-2" />
                                            Delete Organization Permanently
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UsageBar({ label, used, limit, unit = '', color = 'purple' }) {
    const percentage = (used / limit) * 100
    const colorClasses = {
        purple: 'from-purple-600 to-indigo-600',
        blue: 'from-blue-600 to-cyan-600',
        green: 'from-green-600 to-emerald-600'
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {used} {unit} / {limit} {unit}
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                    className={`bg-gradient-to-r ${colorClasses[color]} h-4 rounded-full transition-all duration-500 relative overflow-hidden`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {percentage.toFixed(1)}% used
            </div>
        </div>
    )
}

function UsageCard({ label, used, limit, unit = '', color = 'purple', icon = '📊' }) {
    const percentage = (used / limit) * 100
    const colorClasses = {
        purple: { bg: 'from-purple-500 to-indigo-600', text: 'text-purple-600 dark:text-purple-400' },
        blue: { bg: 'from-blue-500 to-cyan-600', text: 'text-blue-600 dark:text-blue-400' },
        green: { bg: 'from-green-500 to-emerald-600', text: 'text-green-600 dark:text-green-400' }
    }

    return (
        <div className="bg-white dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{icon}</span>
                <span className={`text-2xl font-bold ${colorClasses[color].text}`}>
                    {percentage.toFixed(0)}%
                </span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{label}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {used} {unit} of {limit} {unit}
            </p>
        </div>
    )
}