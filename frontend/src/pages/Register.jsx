import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const [form, setForm] = useState({ username: '', password: '', name: '', email: '', role: 'CANDIDATE' });
    const nav = useNavigate();
    const submit = async e => { e.preventDefault(); await api.post('/auth/register', form); nav('/login'); };
    return (
        <form onSubmit={submit} style={{ maxWidth: 480, margin: '48px auto', display: 'grid', gap: 12 }}>
            <h2>Register</h2>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <button>Create Account</button>
        </form>
    );
}