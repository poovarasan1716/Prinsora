import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const report: any = {
    env: {
      GOOGLE_APPS_SCRIPT_URL: process.env.GOOGLE_APPS_SCRIPT_URL ? 'Defined' : 'MISSING',
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? 'Defined' : 'MISSING',
      GOOGLE_SHEET_NAME: process.env.GOOGLE_SHEET_NAME || 'Inventory (default)',
      GOOGLE_SHEET_ORDERS_NAME: process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders (default)',
      GOOGLE_SHEET_USERS_NAME: process.env.GOOGLE_SHEET_USERS_NAME || 'User_details (default)',
    },
    connections: {}
  };

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json({ success: false, error: 'GOOGLE_APPS_SCRIPT_URL is not set in environment variables.' });
  }

  const sheets = [
    { name: 'Inventory', env: process.env.GOOGLE_SHEET_NAME },
    { name: 'Orders', env: process.env.GOOGLE_SHEET_ORDERS_NAME },
    { name: 'User_details', env: process.env.GOOGLE_SHEET_USERS_NAME },
    { name: 'Order_Items', env: process.env.GOOGLE_SHEET_ORDER_ITEMS_NAME || 'Order_Items' },
  ];

  for (const sheet of sheets) {
    const sheetName = sheet.env || sheet.name;
    try {
      const start = Date.now();
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getSheetData',
          sheetId: process.env.GOOGLE_SHEET_ID,
          sheetName: sheetName,
        }),
      });
      const duration = Date.now() - start;
      
      if (!res.ok) {
        report.connections[sheetName] = { status: res.status, error: 'HTTP Error' };
        continue;
      }

      const data = await res.json().catch(() => null);
      if (!data) {
        report.connections[sheetName] = { status: 'Error', error: 'Bridge returned non-JSON response', duration };
      } else {
        report.connections[sheetName] = { 
          success: data.success, 
          rows: data.products?.length || data.orders?.length || 0,
          error: data.error || null,
          duration 
        };
      }
    } catch (e: any) {
      report.connections[sheetName] = { status: 'Failed', error: e.message };
    }
  }

  return NextResponse.json({ success: true, report });
}
