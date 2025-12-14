'use client';

import { StarFill } from 'react-bootstrap-icons';

interface ReviewDistributionChartProps {
    reviews: { rating: number }[];
}

export default function ReviewDistributionChart({ reviews }: ReviewDistributionChartProps) {
    const total = reviews.length;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(r => {
        const rInt = Math.floor(r.rating) as keyof typeof counts; // Simple floor, or round? Usually floor or exact match. Assuming integer ratings stored mostly, but if float, floor.
        if (counts[rInt] !== undefined) counts[rInt]++;
    });

    return (
        <div className="mb-4">
            {[5, 4, 3, 2, 1].map((star) => {
                const count = counts[star as keyof typeof counts];
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                    <div key={star} className="d-flex align-items-center mb-1" style={{ fontSize: '0.9rem' }}>
                        {/* Label */}
                        <div className="d-flex align-items-center me-2" style={{ width: '20px' }}>
                            <span className="me-1">{star}</span>
                        </div>

                        {/* Bar Container */}
                        <div className="flex-grow-1 bg-light rounded-pill overflow-hidden" style={{ height: '8px', maxWidth: '200px' }}>
                            <div
                                className="bg-warning h-100 rounded-pill"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>

                        {/* Count Label can be optional, maybe hover? Or just visually the bar. User screenshot shows no count number next to bar but checking... 
                           Actually typical UI shows the bar. I'll leave it clean. 
                           User req: "星評価ごとのレビュー件数を横向くバーチャートで可視化されたもの"
                           I'll stick to simple bar.
                        */}
                    </div>
                );
            })}
        </div>
    );
}
