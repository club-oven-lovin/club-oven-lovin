import React from 'react';
import Link from 'next/link';

type QuickActionButtonProps = {
    title: string;
    detail: string;
    icon: React.ReactNode;
    href?: string;
};

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ title, detail, icon, href }) => {
    const content = (
        <>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: '#2A2A2A' }}>
                {icon}
            </span>
            <div className="flex-1">
                <p className="text-base font-bold" style={{ color: '#2A2A2A' }}>{title}</p>
                <p className="text-sm opacity-70" style={{ color: '#2A2A2A' }}>{detail}</p>
            </div>
        </>
    );

    const className = "flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"; // Updated classes

    if (href) {
        return (
            <Link href={href} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" className={className} aria-disabled="true">
            {content}
        </button>
    );
};

export default QuickActionButton;
