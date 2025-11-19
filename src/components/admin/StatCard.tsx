import React from 'react';

type StatCardProps = {
  label: string;
  value: number | string;
  backgroundClass: string;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, backgroundClass }) => (
  <div className={`${backgroundClass} rounded-3xl px-6 py-5 shadow-md`}>
    <p className="text-sm font-medium text-white/80">{label}</p>
    <p className="mt-2 text-3xl font-bold text-white">{value}</p>
  </div>
);

export default StatCard;
