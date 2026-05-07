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
        sheetName: process.env.GOOGLE_SHEET_USERS_NAME || 'User_details',
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch users from bridge');
    }

    // Format: [Timestamp, Name, Email, Phone, Status]
    const users = result.products.map((row: any) => ({
      timestamp: row[0],
      name: row[1],
      email: row[2],
      phone: row[3],
      status: row[4],
    }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
