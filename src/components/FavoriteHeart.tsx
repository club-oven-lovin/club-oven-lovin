'use client';

import { useState, startTransition, MouseEvent } from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { toggleFavorite } from '@/lib/dbActions';

interface FavoriteHeartProps {
    recipeId: number;
    userId: number | null;
    isFavorited: boolean;
}

export default function FavoriteHeart({ recipeId, userId, isFavorited }: FavoriteHeartProps) {
    const [favorited, setFavorited] = useState(isFavorited);
    const [isLoading, setIsLoading] = useState(false);

    async function handleClick(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault(); // Prevent card link navigation
        e.stopPropagation();

        if (!userId) return; // Not logged in

        setIsLoading(true);
        startTransition(async () => {
            const result = await toggleFavorite(userId, recipeId);
            setFavorited(result.favorited);
            setIsLoading(false);
        });
    }

    // Don't render if user is not logged in
    if (!userId) return null;

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className="favorite-heart-btn"
            style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                zIndex: 10,
            }}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            {favorited ? (
                <HeartFill size={18} color="#dc3545" />
            ) : (
                <Heart size={18} color="#dc3545" />
            )}
        </button>
    );
}
