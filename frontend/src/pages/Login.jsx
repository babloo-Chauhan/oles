import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            navigate('/dashboard');
        } catch (err) {
            const message =
                err?.response?.data?.message
                    ? `Invalid credentials. ${err.response.data.message}`
                    : 'Invalid credentials. Please check your username and password.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
            style={{
                backgroundImage: "url('/loginbg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="mt-10 sm:mx-auto p-6 rounded-2xl bg-slate-800/90 sm:w-full sm:max-w-sm shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-center text-emerald-50 text-2xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-100">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="text"
                                name="username"
                                type="username"
                                required
                                autoComplete="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full rounded-md bg-white/10 px-3 py-2 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md bg-white/10 px-3 py-2 text-base text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}
                    {loading && <p className="text-sm text-gray-200">Signing in...</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-300">
                    Not a member?{' '}
                    <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
