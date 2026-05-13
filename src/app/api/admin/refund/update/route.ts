import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { refundId, orderId, status, adminComment } = await req.json();
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' }, { status: 500 });
    }

    // 1. Update status in Refunds sheet
    // Assuming the GAS updateOrderStatus function is generic enough to find the ID in any sheet
    const refundRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateOrderStatus', 
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_REFUNDS_NAME || 'Refunds',
        orderId: refundId, // Pass refundId as orderId to find the row
        status,
      }),
    });

    // 2. If approved/refunded, update the main Orders sheet as well
    if (status === 'Approved' || status === 'Refunded' || status === 'Rejected') {
      let orderStatus = 'Return Requested';
      if (status === 'Refunded') orderStatus = 'Refunded';
      if (status === 'Rejected') orderStatus = 'Delivered'; // Revert to delivered or something similar

      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateOrderStatus',
          sheetId: process.env.GOOGLE_SHEET_ID,
          sheetName: process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders',
          orderId,
          status: orderStatus,
        }),
      });
    }

    const result = await refundRes.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
