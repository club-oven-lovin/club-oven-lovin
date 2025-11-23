'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';

type KitchenTip = {
  title: string;
  description: string;
  tag?: string;
};

type KitchenTipsCardProps = {
  tips: KitchenTip[];
  accentColor?: string;
  className?: string;
};

const KitchenTipsCard = ({ tips, accentColor = '#ff6b35', className = '' }: KitchenTipsCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleTips = tips.length > 1;

  useEffect(() => {
    if (!hasMultipleTips) return undefined;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [hasMultipleTips, tips.length]);

  const currentTip = useMemo(() => tips[currentIndex], [tips, currentIndex]);
  if (!currentTip) return null;

  const handleNextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const cardClasses = ['bg-white text-dark rounded-4 p-4 shadow-lg w-100', className.trim()].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      style={{
        maxWidth: 360,
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <p className="text-uppercase text-muted fw-semibold mb-3">Kitchen tips</p>

      <div className="mb-3 flex-grow-1" style={{ minHeight: 140 }}>
        {currentTip.tag ? (
          <span className="badge bg-body-secondary text-uppercase small fw-semibold mb-2 text-dark">
            {currentTip.tag}
          </span>
        ) : null}
        <h3 className="h4 fw-bold mb-2" style={{ color: accentColor }}>
          {currentTip.title}
        </h3>
        <p className="text-muted mb-0">{currentTip.description}</p>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          {tips.map((_, idx) => (
            <span
              key={`tip-indicator-${idx}`}
              className="rounded-pill"
              style={{
                width: idx === currentIndex ? 28 : 10,
                height: 6,
                backgroundColor: idx === currentIndex ? accentColor : 'rgba(42, 42, 42, 0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
        {hasMultipleTips ? (
          <Button
            variant="light"
            size="sm"
            onClick={handleNextTip}
            className="text-uppercase fw-semibold px-3"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Next tip
          </Button>
        ) : null}
      </div>

      <p className="text-muted small mt-3 mb-0">
        Tip {currentIndex + 1} of {tips.length}
      </p>
    </div>
  );
};

export default KitchenTipsCard;
