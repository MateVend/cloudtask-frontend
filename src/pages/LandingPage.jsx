import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { useEffect, useState } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'

export default function LandingPage() {
    const { isAuthenticated } = useApp()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg sm:text-xl">C</span>
                            </div>
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                CloudTask Pro
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">Features</a>
                            <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">Pricing</a>
                            <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium">Testimonials</a>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5 text-gray-700" />
                                ) : (
                                    <Sun className="w-5 h-5 text-yellow-400" />
                                )}
                            </button>
                            <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex lg:hidden items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5 text-gray-700" />
                                ) : (
                                    <Sun className="w-5 h-5 text-yellow-400" />
                                )}
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden mt-4 pb-4 animate-in fade-in slide-in-from-top-5 duration-200">
                            <div className="flex flex-col space-y-4">
                                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                                <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                                <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium py-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                                    Sign In
                                </Link>
                                <Link to="/register" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg text-center">
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20"></div>

                {/* Animated Background Elements */}
                <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
                <div className="absolute top-40 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="animate-in fade-in slide-in-from-left duration-700">
                            <div className="inline-block mb-4 px-3 sm:px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <span className="text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm">🚀 Now with AI-powered insights</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 dark:from-purple-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    Manage Projects
                                </span>
                                <br />
                                <span className="text-gray-900 dark:text-white">Like a Pro</span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                The all-in-one project management solution trusted by over 10,000 teams worldwide.
                                Collaborate, track, and deliver projects faster than ever.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Link to="/register" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all text-center transform hover:scale-105">
                                    Start Free Trial
                                    <span className="ml-2">→</span>
                                </Link>
                                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold text-base sm:text-lg transition-all transform hover:scale-105">
                                    Watch Demo
                                    <span className="ml-2">▶</span>
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center">
                                    <span className="text-yellow-500 mr-1">★★★★★</span>
                                    <span>4.9/5 (1,200 reviews)</span>
                                </div>
                                <div>✓ No credit card required</div>
                            </div>
                        </div>

                        <div className="relative mt-8 lg:mt-0 animate-in fade-in slide-in-from-right duration-700 delay-300">
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Recent Projects</h3>
                                        <span className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm">View all →</span>
                                    </div>

                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer transform hover:scale-105 duration-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${
                                                        i === 1 ? 'from-purple-500 to-indigo-600' :
                                                            i === 2 ? 'from-blue-500 to-cyan-600' :
                                                                'from-pink-500 to-rose-600'
                                                    } flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0`}>
                                                        {['W', 'M', 'D'][i-1]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                                            {['Website Redesign', 'Mobile App', 'Dashboard'][i-1]}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {['12 tasks', '8 tasks', '15 tasks'][i-1]}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-xs font-semibold flex-shrink-0 ml-2 ${
                                                    i === 1 ? 'text-green-600 dark:text-green-400' :
                                                        i === 2 ? 'text-blue-600 dark:text-blue-400' :
                                                            'text-orange-600 dark:text-orange-400'
                                                }`}>
                                                    {[75, 45, 90][i-1]}%
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                <div className={`h-2 rounded-full bg-gradient-to-r ${
                                                    i === 1 ? 'from-purple-500 to-indigo-600' :
                                                        i === 2 ? 'from-blue-500 to-cyan-600' :
                                                            'from-pink-500 to-rose-600'
                                                } transition-all duration-500`} style={{ width: `${[75, 45, 90][i-1]}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="hidden sm:block absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 border border-purple-200 dark:border-purple-700 animate-bounce-slow">
                                <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">2.5K+</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Tasks Completed</div>
                            </div>

                            <div className="hidden sm:block absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 border border-indigo-200 dark:border-indigo-700 animate-bounce-slow animation-delay-1000">
                                <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">98%</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Client Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By Section */}
            <div className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 font-medium text-sm sm:text-base">Trusted by leading companies worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 opacity-50">
                        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Shopify'].map((company) => (
                            <div key={company} className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500 hover:scale-110 transition-transform">{company}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom duration-700">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Everything you need to succeed</h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400">Powerful features to help your team work smarter</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { icon: '🎯', title: 'Kanban Boards', desc: 'Visualize your workflow with drag-and-drop boards' },
                            { icon: '📊', title: 'Real-time Analytics', desc: 'Track progress with beautiful charts and insights' },
                            { icon: '👥', title: 'Team Collaboration', desc: 'Chat, comment, and work together seamlessly' },
                            { icon: '🔔', title: 'Smart Notifications', desc: 'Stay updated with real-time alerts' },
                            { icon: '📱', title: 'Mobile Apps', desc: 'Manage projects on the go with our mobile app' },
                            { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-level encryption and compliance' },
                            { icon: '🤖', title: 'AI Assistant', desc: 'Get intelligent suggestions and automation' },
                            { icon: '📈', title: 'Custom Reports', desc: 'Generate detailed reports in seconds' },
                            { icon: '🔄', title: 'Integrations', desc: 'Connect with 1000+ apps you already use' },
                        ].map((feature, i) => (
                            <div key={i} className="group p-6 sm:p-8 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                                <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
                        {[
                            { number: '10,000+', label: 'Active Teams' },
                            { number: '500K+', label: 'Projects Created' },
                            { number: '2M+', label: 'Tasks Completed' },
                            { number: '99.9%', label: 'Uptime' },
                        ].map((stat, i) => (
                            <div key={i} className="animate-in fade-in zoom-in duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-sm sm:text-base text-purple-200">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400">Choose the plan that fits your needs</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                name: 'Free',
                                price: '$0',
                                period: 'forever',
                                features: ['3 Projects', '5 Team Members', 'Basic Features', '5GB Storage', 'Community Support'],
                                cta: 'Get Started',
                                popular: false,
                            },
                            {
                                name: 'Pro',
                                price: '$29',
                                period: 'per month',
                                features: ['50 Projects', '20 Team Members', 'All Features', '100GB Storage', 'Priority Support', 'Advanced Analytics'],
                                cta: 'Start Free Trial',
                                popular: true,
                            },
                            {
                                name: 'Enterprise',
                                price: '$99',
                                period: 'per month',
                                features: ['Unlimited Projects', 'Unlimited Members', 'Custom Features', 'Unlimited Storage', 'Dedicated Support', 'Custom Integrations', 'SLA Guarantee'],
                                cta: 'Contact Sales',
                                popular: false,
                            },
                        ].map((plan, i) => (
                            <div key={i} className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-700 ${
                                plan.popular
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl md:scale-105'
                                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                            }`} style={{ animationDelay: `${i * 150}ms` }}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-xs sm:text-sm font-bold animate-bounce">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="text-center mb-6 sm:mb-8">
                                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${!plan.popular && 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                                    <div className="text-4xl sm:text-5xl font-bold mb-2">{plan.price}</div>
                                    <div className={`text-sm ${plan.popular ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'}`}>{plan.period}</div>
                                </div>

                                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm sm:text-base">
                                            <span className={`mr-3 ${plan.popular ? 'text-white' : 'text-green-500'}`}>✓</span>
                                            <span className={plan.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/register"
                                    className={`block text-center py-3 sm:py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                                        plan.popular
                                            ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Loved by thousands of teams</h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400">See what our customers have to say</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            { name: 'Sarah Johnson', role: 'CEO, TechStart', quote: 'CloudTask Pro transformed how our team works. We\'ve seen 3x productivity increase!' },
                            { name: 'Michael Chen', role: 'Product Manager, DesignCo', quote: 'The best project management tool I\'ve ever used. Intuitive and powerful.' },
                            { name: 'Emily Rodriguez', role: 'Team Lead, MarketingPro', quote: 'Finally, a tool that our entire team actually enjoys using. Game changer!' },
                        ].map((testimonial, i) => (
                            <div key={i} className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 transform hover:scale-105 duration-300 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className="text-yellow-500 text-xl sm:text-2xl mb-4">★★★★★</div>
                                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3 sm:mr-4">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{testimonial.name}</div>
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white">
                <div className="max-w-4xl mx-auto text-center animate-in fade-in zoom-in duration-700">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Ready to get started?</h2>
                    <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-purple-100">Join thousands of teams already using CloudTask Pro</p>
                    <Link to="/register" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 hover:bg-gray-100 text-base sm:text-lg rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:scale-110 duration-300">
                        Start Your Free Trial →
                    </Link>
                    <p className="mt-4 text-sm sm:text-base text-purple-200">No credit card required • 14-day free trial • Cancel anytime</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm sm:text-base">C</span>
                                </div>
                                <span className="text-lg sm:text-xl font-bold">CloudTask Pro</span>
                            </div>
                            <p className="text-sm text-gray-400">The future of project management</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
                        <p>© 2024 CloudTask Pro. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                @keyframes animate-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-in {
                    animation: animate-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    )
}