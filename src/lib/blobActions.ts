'use server';

import { del } from '@vercel/blob';
import { prisma } from './prisma';

/**
 * Deletes an uploaded image from Vercel Blob and database
 */
export async function deleteUploadedImage(imageId: string, ownerEmail: string): Promise<void> {
    const image = await prisma.uploadedImage.findUnique({
        where: { id: imageId },
    });

    if (!image) {
        throw new Error('Image not found');
    }

    // Only owner can delete
    if (image.owner !== ownerEmail) {
        throw new Error('Unauthorized');
    }

    // Delete from Vercel Blob
    await del(image.url);

    // Delete from database
    await prisma.uploadedImage.delete({
        where: { id: imageId },
    });
}

/**
 * Deletes an image by URL (used when recipe is deleted)
 */
export async function deleteImageByUrl(url: string): Promise<void> {
    // Check if it's a Vercel Blob URL
    if (!url.includes('blob.vercel-storage.com')) {
        return; // External URL, skip deletion
    }

    try {
        await del(url);

        // Also remove from our tracking table if exists
        await prisma.uploadedImage.deleteMany({
            where: { url },
        });
    } catch (error) {
        console.error('Failed to delete blob:', error);
        // Don't throw - recipe deletion should still succeed
    }
}

/**
 * Get uploaded images by owner
 */
export async function getUploadedImages(owner: string) {
    return prisma.uploadedImage.findMany({
        where: { owner },
        orderBy: { createdAt: 'desc' },
    });
}
