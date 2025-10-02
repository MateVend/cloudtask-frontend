import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useEffect } from 'react'

export default function LandingPage() {
    const { isAuthenticated } = useApp()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        CloudTask Pro
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Project Management<br />Made Simple
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Streamline your workflow, collaborate with your team, and deliver projects faster with CloudTask Pro.
                        </p>
                        <Link to="/register" className="btn btn-primary text-lg px-8 py-4 inline-block">
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="card text-center hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-3">Dashboard Analytics</h3>
                            <p className="text-gray-600">
                                Get real-time insights into your projects and team performance with beautiful analytics.
                            </p>
                        </div>
                        <div className="card text-center hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold mb-3">Kanban Boards</h3>
                            <p className="text-gray-600">
                                Visualize your workflow with drag-and-drop kanban boards for better task management.
                            </p>
                        </div>
                        <div className="card text-center hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
                            <p className="text-gray-600">
                                Invite team members, assign tasks, and communicate seamlessly in one platform.
                            </p>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h3>
                        <p className="text-gray-600 text-lg">Choose the plan that fits your needs</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="card text-center border-2 border-gray-200">
                            <h4 className="text-2xl font-bold mb-2">Free</h4>
                            <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-gray-500">/mo</span></div>
                            <ul className="space-y-3 mb-6 text-left">
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 3 Projects</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 5 Team Members</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic Features</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Community Support</li>
                            </ul>
                            <Link to="/register" className="btn btn-secondary w-full">Get Started</Link>
                        </div>

                        <div className="card text-center border-2 border-purple-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold">
                                POPULAR
                            </div>
                            <h4 className="text-2xl font-bold mb-2">Pro</h4>
                            <div className="text-4xl font-bold mb-4">$29<span className="text-lg text-gray-500">/mo</span></div>
                            <ul className="space-y-3 mb-6 text-left">
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 50 Projects</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 20 Team Members</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> All Features</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Priority Support</li>
                            </ul>
                            <Link to="/register" className="btn btn-primary w-full">Start Free Trial</Link>
                        </div>

                        <div className="card text-center border-2 border-gray-200">
                            <h4 className="text-2xl font-bold mb-2">Enterprise</h4>
                            <div className="text-4xl font-bold mb-4">$99<span className="text-lg text-gray-500">/mo</span></div>
                            <ul className="space-y-3 mb-6 text-left">
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited Projects</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited Members</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Advanced Features</li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Dedicated Support</li>
                            </ul>
                            <Link to="/register" className="btn btn-secondary w-full">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400">© 2024 CloudTask Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}