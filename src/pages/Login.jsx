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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        CloudTask Pro
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
                    <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-gray-600 hover:text-gray-800">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}