import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!code) return NextResponse.json({ success: false, error: 'Code required' });

    // We use the same getPromoCodes action but filter it here for security
    const response = await fetch(scriptUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getPromoCodes',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_PROMOS_NAME || 'Promo_Codes'
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    const codes = data.codes || [];
    // Skip header row
    const found = codes.slice(1).find((row: any) => row[0].toLowerCase() === code.toLowerCase());

    if (!found) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' });
    }

    const promo = {
      code: found[0],
      type: found[1],
      value: parseFloat(found[2]),
      expiry: found[3]
    };

    // Check expiry if exists
    if (promo.expiry) {
      const expiryDate = new Date(promo.expiry);
      if (expiryDate < new Date()) {
        return NextResponse.json({ success: false, error: 'Coupon has expired' });
      }
    }

    return NextResponse.json({ success: true, promo });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
