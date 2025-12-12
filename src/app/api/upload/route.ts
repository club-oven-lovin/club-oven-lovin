import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

export async function POST(request: Request) {
    // Check authentication
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return new NextResponse('No file provided', { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return new NextResponse('Invalid file type. Only JPEG, PNG, GIF, WebP allowed.', { status: 400 });
        }

        // Validate file size (max 10MB before conversion)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return new NextResponse('File too large. Maximum size is 10MB.', { status: 400 });
        }

        // Convert image to WebP using sharp
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const webpBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toBuffer();

        // Generate unique filename with .webp extension
        const timestamp = Date.now();
        const pathname = `recipes/${timestamp}-${Math.random().toString(36).substring(7)}.webp`;

        // Upload WebP to Vercel Blob
        const blob = await put(pathname, webpBuffer, {
            access: 'public',
            contentType: 'image/webp',
        });

        // Save metadata to database
        const uploadedImage = await prisma.uploadedImage.create({
            data: {
                url: blob.url,
                pathname: blob.pathname,
                size: webpBuffer.length,
                owner: userEmail,
            },
        });

        return NextResponse.json({
            id: uploadedImage.id,
            url: blob.url,
            pathname: blob.pathname,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return new NextResponse('Upload failed', { status: 500 });
    }
}

