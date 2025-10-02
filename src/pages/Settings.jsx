import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { organizationAPI } from '../services/api'
import { paymentAPI } from '../services/api'

export default function Settings() {
    const { organization, refreshUser } = useApp()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [usage, setUsage] = useState(null)
    const [activeTab, setActiveTab] = useState('general')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name,
                description: organization.description || '',
            })
            loadUsage()
        }
    }, [organization])

    // Handle successful payment redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const success = urlParams.get('success')
        const canceled = urlParams.get('canceled')

        if (success === 'true') {
            alert('🎉 Payment successful! Your plan has been upgraded.')
            refreshUser()
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname)
        }

        if (canceled === 'true') {
            alert('Payment was cancelled. Your plan has not changed.')
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

    const handleUpdateOrg = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await organizationAPI.update(organization.id, formData)
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

        // Handle downgrade to free
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

        // Handle upgrade to paid plans
        const planNames = {
            pro: 'Pro ($29/month)',
            enterprise: 'Enterprise ($99/month)'
        }

        if (!confirm(`Upgrade to ${planNames[newPlan]}? You will be redirected to Stripe to complete payment.`)) {
            return
        }

        try {
            setLoading(true)
            // Create Stripe Checkout session
            const response = await paymentAPI.createCheckoutSession(newPlan)

            // Redirect to Stripe Checkout
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
            features: ['3 Projects', '5 Team Members', 'Basic Features', 'Community Support'],
        },
        {
            name: 'pro',
            title: 'Pro',
            price: '$29',
            features: ['50 Projects', '20 Team Members', 'All Features', 'Priority Support'],
            popular: true,
        },
        {
            name: 'enterprise',
            title: 'Enterprise',
            price: '$99',
            features: ['Unlimited Projects', 'Unlimited Members', 'Advanced Features', 'Dedicated Support'],
        },
    ]

    const tabs = [
        { id: 'general', label: 'General', icon: '⚙️' },
        { id: 'plan', label: 'Plan & Billing', icon: '💳' },
        { id: 'usage', label: 'Usage', icon: '📊' },
        { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your organization settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="card">
                    <h2 className="text-xl font-semibold mb-6">Organization Information</h2>
                    <form onSubmit={handleUpdateOrg} className="space-y-6">
                        <div>
                            <label className="label">Organization Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input"
                                rows="4"
                                placeholder="Tell us about your organization..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="label">Organization Logo</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {organization?.name?.charAt(0)}
                                </div>
                                <div>
                                    <button type="button" className="btn btn-secondary text-sm">
                                        Upload Logo
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or SVG. Max 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Plan & Billing Tab */}
            {activeTab === 'plan' && (
                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                            <div>
                                <div className="text-2xl font-bold capitalize">{organization?.plan} Plan</div>
                                <div className="text-gray-600 mt-1">
                                    {plans.find((p) => p.name === organization?.plan)?.price}/month
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Status</div>
                                <div className="text-green-600 font-semibold">Active</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`card relative ${
                                    plan.popular ? 'border-2 border-purple-600' : ''
                                } ${organization?.plan === plan.name ? 'ring-2 ring-purple-600' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-semibold">
                                        POPULAR
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                                <div className="text-4xl font-bold mb-6">
                                    {plan.price}
                                    <span className="text-lg text-gray-500">/mo</span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {organization?.plan === plan.name ? (
                                    <button className="btn btn-secondary w-full" disabled>
                                        Current Plan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handlePlanChange(plan.name)}
                                        disabled={loading}
                                        className="btn btn-primary w-full disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : organization?.plan === 'free' ? 'Upgrade' : 'Change Plan'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Usage Tab */}
            {activeTab === 'usage' && usage && (
                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-6">Resource Usage</h2>
                        <div className="space-y-6">
                            {/* Projects Usage */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Projects</span>
                                    <span className="text-sm text-gray-600">
                    {usage.projects.used} / {usage.projects.limit}
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                                        style={{ width: `${(usage.projects.used / usage.projects.limit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Users Usage */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Team Members</span>
                                    <span className="text-sm text-gray-600">
                    {usage.users.used} / {usage.users.limit}
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full"
                                        style={{ width: `${(usage.users.used / usage.users.limit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Storage Usage */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Storage</span>
                                    <span className="text-sm text-gray-600">
                    {usage.storage.used} MB / {usage.storage.limit} MB
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full"
                                        style={{ width: `${(usage.storage.used / usage.storage.limit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {(usage.projects.used / usage.projects.limit > 0.8 || usage.users.used / usage.users.limit > 0.8) && (
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 font-medium">⚠️ You're approaching your plan limits</p>
                                <p className="text-yellow-700 text-sm mt-1">
                                    Consider upgrading your plan to avoid disruptions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
                <div className="card border-red-200">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">⚠️ Danger Zone</h2>
                    <div className="space-y-4">
                        <div className="p-4 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Delete Organization</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Once you delete your organization, there is no going back. This will permanently delete all projects,
                                tasks, and data associated with this organization.
                            </p>
                            <button onClick={handleDeleteOrg} className="btn btn-danger">
                                Delete Organization
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}