import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not set');
    }

    // Call the Bridge to get products
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getProducts',
        sheetId: process.env.GOOGLE_SHEET_ID
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch products from bridge');
    }

    // Map the raw sheet rows to product objects
    const products = result.products.map((row: any, index: number) => {
      const getGoogleDriveDirectLink = (url: string) => {
        if (!url) return '';
        if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
          // Extract ID from various formats
          const match = url.match(/[-\w]{25,}/);
          if (match) {
            return `https://lh3.googleusercontent.com/d/${match[0]}`;
          }
        }
        return url;
      };

      return {
        id: (index + 1).toString(),
        name: row[1],
        description: row[2],
        price: parseInt(row[3]) || 0,
        originalPrice: (parseInt(row[3]) || 0) * 1.5,
        stock: row[4],
        category: row[5],
        img: getGoogleDriveDirectLink(row[6]),
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 200),
        badge: index === 0 ? 'New' : null,
        alt: row[1],
      };
    });

    return NextResponse.json({ products });

  } catch (error: any) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
