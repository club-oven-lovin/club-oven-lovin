'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import Image from 'next/image';
import { XCircleFill, CloudArrowUp, Image as ImageIcon } from 'react-bootstrap-icons';

interface ImageUploaderProps {
    value?: string; // Current image URL
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUploader({ value, onChange, disabled }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Upload failed');
            }

            const data = await response.json();
            onChange(data.url);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            setError(message);
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        } else {
            setError('Please drop an image file');
        }
    }, [handleUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleRemove = useCallback(() => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onChange]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div className="image-uploader">
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-2">
                    {error}
                </Alert>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
                disabled={disabled || uploading}
            />

            {value ? (
                // Preview mode
                <div className="position-relative" style={{ width: '100%', maxWidth: '300px' }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '4/3',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '2px solid #e0e0e0',
                        }}
                    >
                        <Image
                            src={value}
                            alt="Recipe preview"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    {!disabled && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleRemove}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label="Remove image"
                        >
                            <XCircleFill size={16} />
                        </Button>
                    )}
                </div>
            ) : (
                // Upload mode
                <div
                    onClick={!disabled && !uploading ? handleClick : undefined}
                    onDrop={!disabled && !uploading ? handleDrop : undefined}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    style={{
                        width: '100%',
                        maxWidth: '300px',
                        aspectRatio: '4/3',
                        border: `2px dashed ${dragOver ? '#ff6b35' : '#ccc'}`,
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: disabled || uploading ? 'not-allowed' : 'pointer',
                        backgroundColor: dragOver ? '#fff8f1' : '#f9f9f9',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {uploading ? (
                        <>
                            <Spinner animation="border" variant="warning" className="mb-2" />
                            <span className="text-muted">Uploading...</span>
                        </>
                    ) : (
                        <>
                            {dragOver ? (
                                <CloudArrowUp size={48} color="#ff6b35" />
                            ) : (
                                <ImageIcon size={48} color="#ccc" />
                            )}
                            <span className="mt-2 text-muted small">
                                Click or drag image here
                            </span>
                            <span className="text-muted small">
                                JPEG, PNG, GIF, WebP (max 5MB)
                            </span>
                        </>
                    )}
                </div>
            )}

            <style jsx>{`
        .image-uploader :global(.position-relative):hover :global(button) {
          opacity: 1;
        }
      `}</style>
        </div>
    );
}
