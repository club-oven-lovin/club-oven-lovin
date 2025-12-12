import React from 'react';

type StatCardProps = {
    label: string;
    value: number | string;
    accentStart: string;
    accentEnd: string;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, accentStart, accentEnd }) => (
    <div
        className="rounded-3xl px-6 py-5 shadow-sm transition hover:shadow-md"
        style={{
            background: `linear-gradient(135deg, ${accentStart}, ${accentEnd})`,
            boxShadow: '0 1rem 2rem rgba(255, 107, 53, 0.05)',
        }}
    >
        <p className="text-sm font-semibold uppercase tracking-wide opacity-70" style={{ color: '#2A2A2A' }}>{label}</p>
        <p className="mt-1 text-3xl font-bold" style={{ color: '#2A2A2A' }}>{value}</p>
    </div>
);

export default StatCard;
