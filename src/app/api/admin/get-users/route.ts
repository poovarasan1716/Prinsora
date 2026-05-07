import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not set');
    }

    const usersRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getSheetData',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_USERS_NAME || 'User_details',
      }),
    });

    const result = await usersRes.json().catch(() => ({ success: false, error: 'Bridge returned invalid response' }));

    if (!result.success) {
      console.error('Users Bridge Error:', result.error);
      return NextResponse.json({ success: false, error: result.error || 'Failed to fetch users' }, { status: 500 });
    }

    // Format: [Timestamp, Name, Email, Phone, Status]
    let rawRows = result.products || result.orders || [];
    
    // Filter out header row
    if (rawRows.length > 0 && Array.isArray(rawRows[0])) {
      const firstRow = rawRows[0].map((c: any) => String(c).toLowerCase());
      if (firstRow.some((c: string) => c.includes('name') || c.includes('email') || c.includes('timestamp'))) {
        rawRows = rawRows.slice(1);
      }
    }

    const users = rawRows
      .filter((row: any) => Array.isArray(row) && row.length >= 2)
      .map((row: any) => ({
        timestamp: row[0],
        name: row[1] || 'Unnamed User',
        email: row[2] || 'N/A',
        phone: row[3] || 'N/A',
        status: row[4] || 'Active',
      }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
