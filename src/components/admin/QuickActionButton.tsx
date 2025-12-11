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
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">{icon}</span>
            <div className="flex-1">
                <p className="text-base font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-600">{detail}</p>
            </div>
        </>
    );

    const className = "flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg";

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
