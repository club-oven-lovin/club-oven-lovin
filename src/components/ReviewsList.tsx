'use client';

import { useState } from 'react';
import { Star, StarFill, ThreeDots, Trash } from 'react-bootstrap-icons';
import { Button, Dropdown, Form, Pagination } from 'react-bootstrap';
import { deleteReview, deleteReviewsBulk } from '@/lib/reviewActions';
import ReviewDistributionChart from './ReviewDistributionChart';
import StarRating from './StarRating';

interface Review {
    id: number;
    rating: number;
    comment: string;
    reviewer: string;
    owner: string | null;
    createdAt: Date;
    recipeId: number;
}

interface ReviewsListProps {
    reviews: Review[];
    currentUserEmail: string | null;
    isAdmin: boolean;
}

const ITEMS_PER_PAGE = 5;

export default function ReviewsList({ reviews, currentUserEmail, isAdmin }: ReviewsListProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedReviews, setSelectedReviews] = useState<number[]>([]);

    // Sort by date desc
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate Average
    const totalRating = sortedReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sortedReviews.length > 0 ? totalRating / sortedReviews.length : 0;

    // View Logic
    const displayedReviews = isExpanded
        ? sortedReviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
        : sortedReviews.slice(0, 2);

    const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const handleDelete = async (reviewId: number) => {
        if (confirm('Are you sure you want to delete this review?')) {
            await deleteReview(reviewId);
        }
    };

    const handleBulkDelete = async () => {
        if (confirm(`Delete ${selectedReviews.length} reviews?`)) {
            await deleteReviewsBulk(selectedReviews);
            setSelectedReviews([]);
        }
    };

    const toggleSelection = (id: number) => {
        if (selectedReviews.includes(id)) {
            setSelectedReviews(selectedReviews.filter(reviewId => reviewId !== id));
        } else {
            setSelectedReviews([...selectedReviews, id]);
        }
    };

    return (
        <div>
            {/* Header / Summary is mainly handled in Parent Page, but Expanded View needs the Chart and Summary */}
            {isExpanded && (
                <div className="mb-4">
                    <div className="row">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-light rounded p-3">
                                <div className="display-4 fw-bold">{averageRating.toFixed(1)}</div>
                                <div className="mb-1">
                                    <StarRating rating={averageRating} showCount={false} size={24} />
                                </div>
                                <div className="text-muted small">{reviews.length} reviews</div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <ReviewDistributionChart reviews={reviews} />
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Bulk Actions */}
            {isExpanded && isAdmin && selectedReviews.length > 0 && (
                <div className="bg-light p-2 mb-3 rounded d-flex justify-content-between align-items-center">
                    <span>{selectedReviews.length} selected</span>
                    <Button variant="danger" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
                </div>
            )}

            {/* List */}
            <div className="d-flex flex-column gap-3">
                {displayedReviews.map((review) => (
                    <div key={review.id} className="border-bottom pb-3 last:border-0">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center gap-2">
                                {isExpanded && isAdmin && (
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedReviews.includes(review.id)}
                                        onChange={() => toggleSelection(review.id)}
                                    />
                                )}
                                <span className="fw-semibold">{review.reviewer}</span>
                            </div>

                            <div className="d-flex flex-column align-items-end gap-1">
                                {/* Action Menu or Placeholder */}
                                <div style={{ height: '24px', minWidth: '24px' }} className="d-flex justify-content-end">
                                    {(currentUserEmail === review.owner || isAdmin) ? (
                                        <Dropdown align="end">
                                            <Dropdown.Toggle variant="link" className="p-0 text-muted d-flex align-items-center" id={`dropdown-${review.id}`} bsPrefix="p-0">
                                                <ThreeDots size={20} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="p-0 border-0 shadow-sm" style={{ minWidth: 'auto' }}>
                                                <Dropdown.Item
                                                    onClick={() => handleDelete(review.id)}
                                                    className="d-flex align-items-center gap-2 small rounded px-2 py-1 user-select-none"
                                                    style={{
                                                        transition: 'all 0.2s',
                                                        cursor: 'pointer',
                                                        color: '#dc3545' // Initial color (text-danger)
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#dc3545';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.color = '#dc3545';
                                                    }}
                                                >
                                                    <Trash size={14} />
                                                    <span>Delete</span>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    ) : null}
                                </div>

                                {/* Star Rating */}
                                <div className="d-flex text-warning">
                                    <StarRating rating={review.rating} showCount={false} size={14} />
                                </div>
                            </div>
                        </div>
                        <p className="mb-1">{review.comment}</p>
                        <small className="text-muted">
                            {new Date(review.createdAt).toISOString().split('T')[0].replace(/-/g, '/')}
                        </small>
                    </div>
                ))}
            </div>

            {/* Toggle Button */}
            {!isExpanded && reviews.length > 2 && (
                <button
                    onClick={toggleExpand}
                    className="btn btn-link w-100 text-decoration-none mt-2 fw-semibold"
                >
                    Read {reviews.length - 2} more reviews
                </button>
            )}

            {/* Pagination for Expanded View */}
            {isExpanded && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                        {[...Array(totalPages)].map((_, i) => (
                            <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
                    </Pagination>
                </div>
            )}

            {isExpanded && (
                <button
                    onClick={toggleExpand}
                    className="btn btn-link w-100 text-decoration-none mt-4 text-muted"
                >
                    Show less
                </button>
            )}
        </div>
    );
}
