import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const [username, setU] = useState('');
    const [password, setP] = useState('');
    const [err, setErr] = useState('');
    const nav = useNavigate();
    const submit = async e => {
        e.preventDefault(); setErr('');
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            nav('/dashboard');
        } catch (e) { setErr('Invalid credentials',e.err); }
    }
    return (
        <form onSubmit={submit} style={{ maxWidth: 380, margin: '48px auto', display: 'grid', gap: 12 }}>
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={e => setU(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={e => setP(e.target.value)} />
            {err && <div style={{ color: 'red' }}>{err}</div>}
            <button>Login</button>
        </form>
    );
}