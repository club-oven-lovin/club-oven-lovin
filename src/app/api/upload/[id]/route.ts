import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    // Check authentication
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { id } = params;

        // Find the image
        const image = await prisma.uploadedImage.findUnique({
            where: { id },
        });

        if (!image) {
            return new NextResponse('Image not found', { status: 404 });
        }

        // Check ownership
        if (image.owner !== userEmail) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        // Delete from Vercel Blob
        await del(image.url);

        // Delete from database
        await prisma.uploadedImage.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Delete error:', error);
        return new NextResponse('Delete failed', { status: 500 });
    }
}
