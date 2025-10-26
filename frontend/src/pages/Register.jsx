import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'CANDIDATE',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', form);
            nav('/login');
        } catch (e) {
            setError('Registration failed. Please try again.',e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-cover bg-center px-4"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="w-full max-w-md bg-black/60 backdrop-blur-md p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Create an Account</h2>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <input
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full rounded-md bg-white/20 px-3 py-2 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-white font-semibold hover:bg-indigo-400 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-300">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
