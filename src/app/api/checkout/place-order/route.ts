import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cartItems, address, paymentMethod, total } = await req.json();
    const orderId = 'PNS' + Date.now().toString().slice(-8);
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_APPS_SCRIPT_URL not set' },
        { status: 500 }
      );
    }

    // 1. Prepare Order Summary (One row)
    const orderSummary = [
      new Date().toLocaleString(),
      orderId,
      address.fullName,
      address.phone,
      address.email,
      `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
      total,
      paymentMethod,
      'Confirmed', // Setting to Confirmed as payment is simulated as successful
    ];

    // 2. Prepare Order Items (Multiple rows)
    const orderItems = cartItems.map((item: any) => [
      new Date().toLocaleString(),
      orderId,
      item.name,
      item.size || 'N/A',
      item.quantity,
      item.price,
      item.price * item.quantity,
    ]);

    // Send Summary to Orders Sheet
    console.log(`Sending order summary to sheet: ${process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders'}`);
    const summaryRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'placeOrder',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders',
        orderRows: [orderSummary],
      }),
    });

    // Small delay to prevent concurrency issues in Google Sheets
    await new Promise(resolve => setTimeout(resolve, 500));

    // Send Details to Order_Items Sheet
    console.log(`Sending order items to sheet: ${process.env.GOOGLE_SHEET_ORDER_ITEMS_NAME || 'Order_Items'}`);
    const itemsRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'placeOrder',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_ORDER_ITEMS_NAME || 'Order_Items',
        orderRows: orderItems,
      }),
    });

    let sumJson, itemJson;
    try {
      sumJson = await summaryRes.json();
      itemJson = await itemsRes.json();
    } catch (e) {
      console.error('Failed to parse bridge response as JSON.');
      return NextResponse.json({ success: false, error: 'Bridge returned non-JSON response' }, { status: 500 });
    }

    console.log('Summary Sync Result:', sumJson);
    console.log('Items Sync Result:', itemJson);

    if (sumJson.success && itemJson.success) {
      return NextResponse.json({ success: true, orderId });
    } else {
      const errorMsg = (sumJson.error || itemJson.error || 'Order bridge failed').toString();
      console.error('Bridge Error:', errorMsg);
      return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
