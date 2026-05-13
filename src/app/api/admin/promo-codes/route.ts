import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) return NextResponse.json({ success: false, error: 'Not configured' }, { status: 500 });

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getPromoCodes',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_PROMOS_NAME || 'Promo_Codes'
      }),
    });

    const data = await response.json();
    let codes = data.codes || [];
    if (codes.length > 0) {
      const headers = codes[0].map((h: any) => String(h).toLowerCase());
      codes = codes.slice(1).map((row: any) => ({
        code: row[0],
        type: row[1],
        value: row[2],
        expiry: row[3],
        usage: row[4]
      }));
    }

    return NextResponse.json({ success: true, codes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, type, value, expiry } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addPromoCode',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_PROMOS_NAME || 'Promo_Codes',
        code, type, value, expiry
      }),
    });

    return NextResponse.json(await response.json());
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { code } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deletePromoCode',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_PROMOS_NAME || 'Promo_Codes',
        code
      }),
    });

    return NextResponse.json(await response.json());
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
