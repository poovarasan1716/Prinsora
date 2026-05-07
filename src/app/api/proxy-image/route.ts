import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Missing image ID', { status: 400 });
  }

  try {
    // Construct the direct download URL
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const response = await fetch(driveUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Drive: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    // Return the image directly with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Image Proxy Error:', error);
    return new NextResponse('Failed to load image', { status: 500 });
  }
}
