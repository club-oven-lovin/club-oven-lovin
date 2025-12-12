import React from 'react';

type RecentReportItemProps = {
    title: string;
    detail?: string;
};

const RecentReportItem: React.FC<RecentReportItemProps> = ({ title, detail }) => (
    <li className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:shadow-md">
        <p className="text-base font-bold text-[#2A2A2A]">{title}</p>
        {detail ? <p className="mt-2 text-sm opacity-70 text-[#2A2A2A]">{detail}</p> : null}
    </li>
);

export default RecentReportItem;
