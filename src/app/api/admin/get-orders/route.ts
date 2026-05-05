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
        sheetName: process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders'
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch orders from bridge');
    }

    // result.orders contains rows from the 'Orders' sheet (Summary)
    // Schema: [Date, OrderID, Name, Phone, Email, Address, Total, Payment, Status]
    const orders = result.orders.map((row: any) => ({
      date: row[0],
      id: row[1],
      customer: row[2],
      phone: row[3],
      email: row[4],
      address: row[5],
      total: parseFloat(row[6]) || 0,
      payment: row[7],
      status: row[8] || 'Confirmed',
      items: [] // In summary view, we don't fetch line items to keep it clean
    })).sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ success: true, orders });

  } catch (error: any) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
