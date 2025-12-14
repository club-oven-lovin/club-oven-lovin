'use client';

import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';

interface StarRatingProps {
    rating: number;
    count?: number; // Kept for interface compatibility but not used for display if we only want stars
    size?: number; // MUI uses 'small' | 'medium' | 'large', but we can use sx for pixel size
    showCount?: boolean; // If true, we might show count? User wanted NO numbers in list.
}

// Simple wrapper for MUI Rating
export default function StarRating({ rating, size = 20, showCount = false }: StarRatingProps) {
    return (
        <div className="d-flex align-items-center">
            <Rating
                name="read-only"
                value={rating}
                precision={0.1}
                readOnly
                sx={{
                    fontSize: size,
                    // Ensure icons are colored correctly (default is yellow/amber usually, but can enforce)
                    '& .MuiRating-iconFilled': {
                        color: '#ffc107',
                    },
                    '& .MuiRating-iconEmpty': {
                        color: '#e4e5e9',
                    }
                }}
            />
            {/* If we ever needed to show count, we could here, but per request we strictly only render stars unless configured otherwise. 
          Current usage in ReviewsList passes `showCount={false}`. 
          The previous manual `StarRating` rendered the numeric value. This one does NOT.
      */}
        </div>
    );
}
