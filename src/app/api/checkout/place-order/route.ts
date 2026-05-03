import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cartItems, address, paymentMethod, total } = await req.json();
    const orderId = 'PNS' + Date.now().toString().slice(-8);
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({ success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' }, { status: 500 });
    }

    // Prepare order rows for Apps Script
    const orderRows = cartItems.map((item: any) => [
      new Date().toLocaleString(),
      orderId,
      address.fullName,
      address.phone,
      address.email,
      `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
      item.name,
      item.quantity,
      item.price,
      paymentMethod,
      'Pending'
    ]);

    // Send order to Apps Script Bridge
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'placeOrder', // The flag for the Apps Script
        sheetId: process.env.GOOGLE_SHEET_ID,
        orderRows,
        cartItems // Needed for stock subtraction
      }),
    });

    const result = await response.json();
    console.log('Apps Script Order Result:', result);

    if (result.success) {
      return NextResponse.json({ success: true, orderId });
    } else {
      console.error('Apps Script Order Error Details:', result.error);
      throw new Error(result.error || 'Order bridge failed');
    }

  } catch (error: any) {
    console.error('Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
