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
        action: 'getSheetData',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_NAME
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch products from bridge');
    }

    // Filter out header row if present (checking if first column is "Name" or "ID" or similar)
    let rawRows = result.products || [];
    if (rawRows.length > 0 && (rawRows[0][0] === 'ID' || rawRows[0][1] === 'Name' || rawRows[0][1] === 'name')) {
      rawRows = rawRows.slice(1);
    }

    // Map the raw sheet rows to product objects
    const sheetProducts = rawRows.map((row: any, index: number) => {
      const getGoogleDriveDirectLink = (url: string) => {
        if (!url) return '';
        if (typeof url !== 'string') return '';
        
        if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
          const match = url.match(/[-\w]{25,}/);
          if (match) {
            // Use our internal proxy to bypass all Google Drive security blocks
            return `/api/proxy-image?id=${match[0]}`;
          }
        }
        return url;
      };

      const id = row[0] || (index + 1).toString();
      const name = row[1] || 'Unnamed Product';
      const price = parseInt(row[3]) || 0;

      return {
        id: id,
        name: name,
        description: row[2] || '',
        price: price,
        originalPrice: price * 1.2,
        stock: parseInt(row[4]) || 0,
        category: row[5] || 'General',
        sizes: (row[6] || 'XS, S, M, L, XL').toString().split(',').map((s: string) => s.trim()),
        image: getGoogleDriveDirectLink(row[7]),
        avatar: getGoogleDriveDirectLink(row[8]),
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 200),
        badge: index === 0 ? 'New' : null,
        tag: index % 3 === 0 ? 'Luxury' : null,
        alt: name,
      };
    });

    // Import local products for enrichment
    const { products: localProducts } = require('@/data/products');
    
    // Merge: Prefer local assets for seed products (ID 1-10) to ensure images always show
    const products = sheetProducts.map((p: any) => {
      const local = localProducts.find((lp: any) => lp.id === p.id);
      if (local) {
        return {
          ...p,
          name: p.name === 'Unnamed Product' || !p.name ? local.name : p.name,
          description: !p.description ? local.description : p.description,
          image: local.image || p.image, // Prefer local asset image for reliability
          tag: local.tag || p.tag,
          rating: local.rating || p.rating,
          reviews: local.reviews || p.reviews,
        };
      }
      return p;
    });

    // If sheet is empty, use local products as fallback
    const finalProducts = products.length > 0 ? products : localProducts;

    return NextResponse.json({ products: finalProducts });

  } catch (error: any) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
