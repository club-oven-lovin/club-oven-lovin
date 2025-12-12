'use client';

import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';

interface ReviewModalProps {
    recipeId: number;
    recipeName: string;
}

export default function ReviewModal({ recipeId, recipeName }: ReviewModalProps) {
    const [show, setShow] = useState(false);
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const handleClose = () => {
        setShow(false);
        setReviewName('');
        setReviewRating(5);
        setHoverRating(0);
        setReviewText('');
    };
    const handleShow = () => setShow(true);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, this would be a server action or API call
        alert(`Review for "${recipeName}" submitted! (DB connection pending)`);
        handleClose();
    };

    return (
        <>
            <Button
                variant="outline-dark"
                onClick={handleShow}
                className="w-100 mb-3"
            >
                Write a Review
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Review {recipeName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Your Name (optional)</Form.Label>
                            <Form.Control
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="Anonymous"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <div className="d-flex align-items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= (hoverRating || reviewRating);
                                    return (
                                        <span
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setReviewRating(star)}
                                            style={{ cursor: 'pointer', color: '#ff6b35' }}
                                        >
                                            {isFilled ? <StarFill size={20} /> : <Star size={20} />}
                                        </span>
                                    );
                                })}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Your Review</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="What did you think of this recipe?"
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Submit Review
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
