import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        organization_name: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useApp()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)
        const result = await register(formData)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        CloudTask Pro
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
                    <p className="mt-2 text-gray-600">Start managing your projects today</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Organization Name</label>
                            <input
                                type="text"
                                name="organization_name"
                                value={formData.organization_name}
                                onChange={handleChange}
                                className="input"
                                placeholder="Acme Inc."
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
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
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                                Sign in
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