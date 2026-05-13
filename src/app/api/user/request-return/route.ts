import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { orderId, reason, email } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' }, { status: 500 });
    }

    if (!orderId || !email) {
      return NextResponse.json({ success: false, error: 'Order ID and Email are required' }, { status: 400 });
    }

    // In a real app, we would verify that this order actually belongs to this email
    // For now, we trust the client request for simplicity in this bridge implementation

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateOrderStatus',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders',
        orderId,
        status: 'Return Requested',
        // We could potentially store the reason in a 'Notes' column if it exists
        // Or just log it for now
      }),
    });

    const result = await response.json();
    console.log(`Return requested for order ${orderId} by ${email}. Reason: ${reason}`);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Request Return Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
