import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    const response = await fetch(scriptUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getReviews',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_REVIEWS_NAME || 'Reviews',
        productId
      }),
    });

    const data = await response.json();
    let reviews = data.reviews || [];
    
    // Status check for non-admin requests
    const isAdmin = req.nextUrl.searchParams.get('admin') === 'true';
    
    const getGoogleDriveDirectLink = (url: string) => {
      if (!url) return '';
      if (typeof url !== 'string') return '';
      if (url.includes('drive.google.com') || url.includes('docs.google.com') || url.includes('googleusercontent.com')) {
        const match = url.match(/[-\w]{25,}/);
        if (match) {
          return `/api/proxy-image?id=${match[0]}`;
        }
      }
      return url;
    };

    reviews = reviews.map((row: any) => ({
      timestamp: row[0],
      productId: row[1],
      userName: row[2],
      rating: row[3],
      comment: row[4],
      imageUrl: getGoogleDriveDirectLink(row[5]),
      status: row[6]
    }));

    if (!isAdmin) {
      reviews = reviews.filter((r: any) => r.status === 'Approved');
    }

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    const response = await fetch(scriptUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: body.action || 'addReview', // Can be 'addReview' or 'updateReviewStatus'
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_REVIEWS_NAME || 'Reviews',
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
        ...body
      }),
    });

    return NextResponse.json(await response.json());
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
