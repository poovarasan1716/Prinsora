import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' }, { status: 500 });
    }

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deleteProduct',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_NAME,
        productId: productId
      }),
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Delete Product Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
