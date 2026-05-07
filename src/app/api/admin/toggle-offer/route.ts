import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productId, productName, offerTag, action: toggleAction } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not set');
    }

    // Call the Bridge to add/remove from Offer_product sheet
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: toggleAction === 'add' ? 'addOffer' : 'deleteOffer',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_OFFERS_NAME || 'Offer_product',
        productId: productId,
        productName: productName,
        tag: offerTag || 'Offer'
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update offer sheet');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Toggle Offer Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
