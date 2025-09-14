import React from 'react';
export default function QuestionCard({ q, value, onChange }) {
    return (
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontWeight: 600 }}>{q.text}</div>
            {[1, 2, 3, 4].map(i =>
                <label key={i} style={{ display: 'block', marginTop: 6 }}>
                    <input type="radio" name={`q-${q.id}`} checked={value === i} onChange={() => onChange(i)} /> {q[`choice${i}`]}
                </label>
            )}
        </div>
    );
}