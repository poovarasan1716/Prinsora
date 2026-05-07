import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not set');
    }

    const productsRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getSheetData',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_NAME || 'Inventory',
      }),
    });

    const result = await productsRes.json().catch(() => ({ success: false, error: 'Inventory bridge returned invalid JSON' }));

    if (!result.success) {
      console.error('Inventory Fetch Failed:', result.error);
      // If inventory fails, we might still want to return local products
      const { products: localProducts } = require('@/data/products');
      return NextResponse.json({ products: localProducts, warning: result.error });
    }

    // Fetch Offers data
    const offersRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getSheetData',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_OFFERS_NAME || 'Offer_product',
      }),
    });
    const offersResult = await offersRes.json().catch(() => ({ success: false }));
    const offerRows = (offersResult.success && (offersResult.products || offersResult.orders)) ? (offersResult.products || offersResult.orders) : [];
    
    // Create a map of product ID -> offer tag
    const offerMap: Record<string, string> = {};
    offerRows.forEach((row: any) => {
      // Structure: [Timestamp, ProductId, ProductName, Tag]
      if (Array.isArray(row) && row[1] && row[1] !== 'ProductId' && row[1] !== 'ID') {
        offerMap[row[1].toString()] = row[3] || 'Offer';
      }
    });

    // Filter out header row if present
    let rawRows = result.products || result.orders || [];
    if (rawRows.length > 0 && Array.isArray(rawRows[0])) {
      const firstRow = rawRows[0].map((c: any) => String(c).toLowerCase());
      const isHeader = firstRow.some((c: string) => 
        c.includes('id') || c.includes('name') || c.includes('url') || c.includes('price') || c.includes('description')
      );
      if (isHeader) {
        rawRows = rawRows.slice(1);
      }
    }

    // Map the raw sheet rows to product objects
    const sheetProducts = rawRows
      .filter((row: any) => Array.isArray(row) && row.length >= 4)
      .map((row: any, index: number) => {
        const getGoogleDriveDirectLink = (url: string) => {
          if (!url) return '';
          if (typeof url !== 'string') return '';

          if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
            const match = url.match(/[-\w]{25,}/);
            if (match) {
              return `/api/proxy-image?id=${match[0]}`;
            }
          }
          return url;
        };

        const id = row[0] || (index + 1).toString();
        const name = row[1] || 'Unnamed Product';
        const price = parseFloat(row[3]) || 0;

        return {
          id: id.toString(),
          name: name,
          description: row[2] || '',
          price: price,
          originalPrice: price * 1.2,
          stock: parseInt(row[4]) || 0,
          category: row[5] || 'General',
          sizes: (row[6] || 'XS, S, M, L, XL')
            .toString()
            .split(',')
            .map((s: string) => s.trim()),
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

    // Merge: Prefer local assets for seed products (ID 1-10) and apply Offers from the sheet
    const products = sheetProducts.map((p: any) => {
      const local = localProducts.find((lp: any) => lp.id.toString() === p.id);
      const offerTag = offerMap[p.id];
      
      const merged = local ? {
        ...p,
        name: (p.name === 'Unnamed Product' || !p.name) ? local.name : p.name,
        description: !p.description ? local.description : p.description,
        image: local.image || p.image,
        tag: local.tag || p.tag,
        rating: local.rating || p.rating,
        reviews: local.reviews || p.reviews,
      } : p;

      if (offerTag) {
        merged.tag = offerTag;
        const percentageMatch = offerTag.match(/(\d+)%/);
        if (percentageMatch) {
          const discountPercent = parseInt(percentageMatch[1]);
          if (discountPercent > 0 && discountPercent < 100) {
            merged.originalPrice = merged.price;
            merged.price = Math.round(merged.price * (1 - discountPercent / 100));
          }
        }
      }
      
      return merged;
    });

    const finalProducts = products.length > 0 ? products : localProducts;
    return NextResponse.json({ success: true, products: finalProducts });
  } catch (error: any) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
