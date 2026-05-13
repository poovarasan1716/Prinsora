import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not set');
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getSheetData',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_REFUNDS_NAME || 'Refunds',
      }),
    });

    const data = await response.json().catch(() => ({ success: false }));

    if (!data.success) {
      return NextResponse.json({ success: false, error: 'Failed to fetch refunds' }, { status: 500 });
    }

    let rows = data.products || data.orders || [];
    if (rows.length > 0 && Array.isArray(rows[0])) {
      const firstRow = rows[0].map((c: any) => String(c).toLowerCase());
      if (firstRow.some((c: string) => c.includes('id') || c.includes('date'))) {
        rows = rows.slice(1);
      }
    }

    const refunds = rows.map((row: any) => ({
      date: row[0],
      refundId: row[1],
      orderId: row[2],
      email: row[3],
      reason: row[4],
      status: row[5],
      comment: row[6],
      image: row[7],
      type: row[8] || 'Return'
    })).reverse(); // Newest first

    return NextResponse.json({ success: true, refunds });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
