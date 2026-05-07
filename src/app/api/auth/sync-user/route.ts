import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, action = 'syncUser' } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' },
        { status: 500 }
      );
    }

    console.log(`Syncing user ${name} (${email}) to sheet: ${process.env.GOOGLE_SHEET_USERS_NAME || 'User_details'}`);
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: action === 'syncUser' ? 'placeOrder' : action, // Use placeOrder as the generic append action if syncUser was requested
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_USERS_NAME || 'User_details',
        orderRows: [[new Date().toLocaleString(), name, email, phone || 'N/A', 'Active']],
      }),
    });

    const result = await response.json();
    console.log('Sync User Result:', result);
    
    if (!result.success) {
      console.error('User Sync Failed:', result.error);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Sync User Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
