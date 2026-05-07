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
        sheetName: process.env.GOOGLE_SHEET_ORDER_ITEMS_NAME || 'Order_Items',
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch order items from bridge');
    }

    // Format: [Date, OrderID, Product, Size, Qty, Price, Total]
    const items = result.products.map((row: any) => ({
      date: row[0],
      orderId: row[1],
      productName: row[2],
      size: row[3],
      quantity: row[4],
      price: row[5],
      total: row[6],
    }));

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Fetch Order Items Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
