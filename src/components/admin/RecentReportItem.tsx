import React from 'react';

type RecentReportItemProps = {
    title: string;
    detail?: string;
};

const RecentReportItem: React.FC<RecentReportItemProps> = ({ title, detail }) => (
    <li className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-base font-semibold text-slate-900">{title}</p>
        {detail ? <p className="mt-1 text-sm text-slate-600">{detail}</p> : null}
    </li>
);

export default RecentReportItem;
