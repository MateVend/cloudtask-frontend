import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useEffect, useState } from 'react'

export default function LandingPage() {
    const { isAuthenticated } = useApp()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

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
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                CloudTask Pro
              </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
                            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Testimonials</a>
                            <a href="#faq" className="text-gray-700 hover:text-purple-600 transition-colors">FAQ</a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50"></div>

                {/* Animated Background Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-slide-in">
                            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
                                <span className="text-purple-700 font-semibold text-sm">🚀 Now with AI-powered insights</span>
                            </div>

                            <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Projects
                </span>
                                <br />
                                Like a Pro
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                The all-in-one project management solution trusted by over 10,000 teams worldwide.
                                Collaborate, track, and deliver projects faster than ever.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Link to="/register" className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                                    Start Free Trial
                                    <span className="ml-2">→</span>
                                </Link>
                                <button className="btn btn-secondary text-lg px-8 py-4">
                                    Watch Demo
                                    <span className="ml-2">▶</span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className="text-yellow-500 mr-1">★★★★★</span>
                                    <span>4.9/5 (1,200 reviews)</span>
                                </div>
                                <div>✓ No credit card required</div>
                            </div>
                        </div>

                        <div className="relative animate-slide-in animation-delay-200">
                            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                                <div className="space-y-4">
                                    {/* Mock Dashboard Preview */}
                                    <div className="flex items-center justify-between pb-4 border-b">
                                        <h3 className="font-semibold">Recent Projects</h3>
                                        <span className="text-purple-600 text-sm">View all →</span>
                                    </div>

                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors cursor-pointer">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                                                        i === 1 ? 'from-purple-500 to-indigo-600' :
                                                            i === 2 ? 'from-blue-500 to-cyan-600' :
                                                                'from-pink-500 to-rose-600'
                                                    } flex items-center justify-center text-white font-bold`}>
                                                        {['W', 'M', 'D'][i-1]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {['Website Redesign', 'Mobile App', 'Dashboard'][i-1]}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {['12 tasks', '8 tasks', '15 tasks'][i-1]}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`text-xs font-semibold ${
                                                    i === 1 ? 'text-green-600' : i === 2 ? 'text-blue-600' : 'text-orange-600'
                                                }`}>
                                                    {[75, 45, 90][i-1]}%
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`h-2 rounded-full bg-gradient-to-r ${
                                                    i === 1 ? 'from-purple-500 to-indigo-600' :
                                                        i === 2 ? 'from-blue-500 to-cyan-600' :
                                                            'from-pink-500 to-rose-600'
                                                }`} style={{ width: `${[75, 45, 90][i-1]}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-purple-200">
                                <div className="text-2xl font-bold text-purple-600">2.5K+</div>
                                <div className="text-xs text-gray-600">Tasks Completed</div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-indigo-200">
                                <div className="text-2xl font-bold text-indigo-600">98%</div>
                                <div className="text-xs text-gray-600">Client Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By Section */}
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-gray-600 mb-8 font-medium">Trusted by leading companies worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
                        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Shopify'].map((company) => (
                            <div key={company} className="text-2xl font-bold text-gray-400">{company}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">Everything you need to succeed</h2>
                        <p className="text-xl text-gray-600">Powerful features to help your team work smarter</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                            <div key={i} className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '10,000+', label: 'Active Teams' },
                            { number: '500K+', label: 'Projects Created' },
                            { number: '2M+', label: 'Tasks Completed' },
                            { number: '99.9%', label: 'Uptime' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-purple-200">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                            <div key={i} className={`relative rounded-2xl p-8 ${
                                plan.popular
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl scale-105'
                                    : 'bg-white border-2 border-gray-200'
                            }`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="text-5xl font-bold mb-2">{plan.price}</div>
                                    <div className={plan.popular ? 'text-purple-200' : 'text-gray-500'}>{plan.period}</div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <span className={`mr-3 ${plan.popular ? 'text-white' : 'text-green-500'}`}>✓</span>
                                            <span className={plan.popular ? 'text-white' : 'text-gray-700'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/register"
                                    className={`block text-center py-4 px-6 rounded-xl font-semibold transition-all ${
                                        plan.popular
                                            ? 'bg-white text-purple-600 hover:bg-gray-100'
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
            <div id="testimonials" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4">Loved by thousands of teams</h2>
                        <p className="text-xl text-gray-600">See what our customers have to say</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah Johnson', role: 'CEO, TechStart', quote: 'CloudTask Pro transformed how our team works. We\'ve seen 3x productivity increase!' },
                            { name: 'Michael Chen', role: 'Product Manager, DesignCo', quote: 'The best project management tool I\'ve ever used. Intuitive and powerful.' },
                            { name: 'Emily Rodriguez', role: 'Team Lead, MarketingPro', quote: 'Finally, a tool that our entire team actually enjoys using. Game changer!' },
                        ].map((testimonial, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-gray-50 hover:shadow-xl transition-all">
                                <div className="text-yellow-500 text-2xl mb-4">★★★★★</div>
                                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6">Ready to get started?</h2>
                    <p className="text-xl mb-8 text-purple-100">Join thousands of teams already using CloudTask Pro</p>
                    <Link to="/register" className="btn bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 inline-block">
                        Start Your Free Trial →
                    </Link>
                    <p className="mt-4 text-purple-200">No credit card required • 14-day free trial • Cancel anytime</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                    <span className="text-white font-bold">C</span>
                                </div>
                                <span className="text-xl font-bold">CloudTask Pro</span>
                            </div>
                            <p className="text-gray-400">The future of project management</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Features</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-white">Security</a></li>
                                <li><a href="#" className="hover:text-white">Roadmap</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                                <li><a href="#" className="hover:text-white">Terms</a></li>
                                <li><a href="#" className="hover:text-white">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>© 2024 CloudTask Pro. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}