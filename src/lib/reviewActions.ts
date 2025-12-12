'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { prisma } from './prisma';
import authOptions from './authOptions'; // Assuming authOptions is in src/lib/authOptions.ts

export async function addReview(
    recipeId: number,
    reviewName: string,
    rating: number,
    reviewText: string
) {
    try {
        const session = await getServerSession(authOptions);
        const owner = session?.user?.email ?? null;
        const reviewer = reviewName.trim() === '' ? 'Anonymous' : reviewName;

        await prisma.review.create({
            data: {
                recipeId,
                reviewer,
                owner,
                rating,
                comment: reviewText,
            },
        });

        revalidatePath(`/recipes/${recipeId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to add review:', error);
        return { success: false, error: 'Failed to add review' };
    }
}

export async function deleteReview(reviewId: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            return { success: false, error: 'Review not found' };
        }

        const isAdmin = session.user.randomKey === 'ADMIN';
        const isOwner = session.user.email === review.owner;

        if (!isAdmin && !isOwner) {
            return { success: false, error: 'Forbidden' };
        }

        await prisma.review.delete({
            where: { id: reviewId },
        });

        revalidatePath(`/recipes/${review.recipeId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete review:', error);
        return { success: false, error: 'Failed to delete review' };
    }
}

export async function deleteReviewsBulk(reviewIds: number[]) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.randomKey !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Admin only' };
        }

        if (reviewIds.length === 0) return { success: true };

        // We need recipeId for revalidation. Assuming all reviews might be from different recipes?
        // Or getting distinct recipeIds.
        // For simplicity, we might just delete and let page load handle it, but revalidatePath is good practice.
        // We can fetch one review to get recipeId if we assume bulk delete is usually per page.
        // Or we just revalidate all paths or the specific ones. 
        // Given complexity, let's just delete. UI will update on refresh.
        // Actually, efficiently finding affected recipes:
        const reviews = await prisma.review.findMany({
            where: { id: { in: reviewIds } },
            select: { recipeId: true },
            distinct: ['recipeId']
        });

        await prisma.review.deleteMany({
            where: { id: { in: reviewIds } },
        });

        for (const r of reviews) {
            revalidatePath(`/recipes/${r.recipeId}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to delete reviews:', error);
        return { success: false, error: 'Failed to delete reviews' };
    }
}
