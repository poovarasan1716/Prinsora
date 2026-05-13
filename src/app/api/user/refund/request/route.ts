import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { orderId, email, requestType, reason, comment, image } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' }, { status: 500 });
    }

    const refundId = 'RF' + Date.now().toString().slice(-8);
    
    // 1. Submit Refund Request (with Drive upload)
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addRefund',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_REFUNDS_NAME || 'Refunds',
        folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
        refundId,
        orderId,
        email,
        requestType,
        reason,
        comment,
        imageData: image ? image.split(',')[1] : null, // Extract base64 part
        mimeType: image ? image.split(';')[0].split(':')[1] : "image/png"
      }),
    });

    // Update the order status to reflect the specific request type
    const newStatus = requestType === 'Refund' ? 'Refund Requested' : 'Return Requested';
    
    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateOrderStatus',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders',
        orderId,
        status: newStatus,
      }),
    });

    const result = await response.json();
    return NextResponse.json({ success: true, refundId, result });
  } catch (error: any) {
    console.error('Refund Request Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
