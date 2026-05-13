import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { category, change, type } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'bulkUpdatePrices',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_NAME,
        category,
        change,
        type
      }),
    });

    return NextResponse.json(await response.json());
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
