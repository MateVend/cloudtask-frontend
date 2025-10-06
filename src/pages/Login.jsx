import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useApp()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await login(email, password)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 px-4 sm:px-6 py-8 sm:py-12 transition-colors">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <Link
                        to="/"
                        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent"
                    >
                        CloudTask Pro
                    </Link>
                    <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                    {error && (
                        <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all text-sm sm:text-base"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all text-sm sm:text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white rounded-xl font-semibold shadow-lg transition-all disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-5 sm:mt-6 text-center">
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 sm:mt-8 text-center">
                    <Link
                        to="/"
                        className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
