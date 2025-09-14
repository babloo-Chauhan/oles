import React, { useEffect, useState } from 'react';
import api from '../api';


export default function Result() {
    const [items, setItems] = useState([]);
    useEffect(() => { api.get('/candidate/results').then(r => setItems(r.data)); }, []);
    return (
        <div style={{ maxWidth: 720, margin: '24px auto' }}>
            <h2>My Results</h2>
            <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
                <thead><tr><th>Exam</th><th>Score</th><th>Total</th></tr></thead>
                <tbody>
                    {items.map(r => (
                        <tr key={r.id}><td>{r.exam?.title}</td><td>{r.score}</td><td>{r.total}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}