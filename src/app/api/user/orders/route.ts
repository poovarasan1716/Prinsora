import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not set');
    }

    // 1. Fetch Orders (Summary)
    const ordersRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getSheetData',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_ORDERS_NAME || 'Orders',
      }),
    });

    const ordersData = await ordersRes.json().catch(() => ({ success: false }));

    if (!ordersData.success) {
      return NextResponse.json({ success: false, error: 'Failed to fetch orders from bridge' }, { status: 500 });
    }

    // 2. Fetch Order Items (Line items)
    const itemsRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getSheetData',
        sheetId: process.env.GOOGLE_SHEET_ID,
        sheetName: process.env.GOOGLE_SHEET_ORDER_ITEMS_NAME || 'Order_Items',
      }),
    });

    const itemsData = await itemsRes.json().catch(() => ({ success: false }));
    
    // Process Orders Summary
    let orderRows = ordersData.products || ordersData.orders || [];
    if (orderRows.length > 0 && Array.isArray(orderRows[0])) {
      const firstRow = orderRows[0].map((c: any) => String(c).toLowerCase());
      if (firstRow.some((c: string) => c.includes('order') || c.includes('id') || c.includes('date'))) {
        orderRows = orderRows.slice(1);
      }
    }

    // Process Order Items
    let itemRows = (itemsData.success && (itemsData.products || itemsData.orders)) ? (itemsData.products || itemsData.orders) : [];
    if (itemRows.length > 0 && Array.isArray(itemRows[0])) {
      const firstRow = itemRows[0].map((c: any) => String(c).toLowerCase());
      if (firstRow.some((c: string) => c.includes('product') || c.includes('qty'))) {
        itemRows = itemRows.slice(1);
      }
    }

    // Map items to order IDs (trimming to avoid mismatch)
    const itemsByOrder: Record<string, any[]> = {};
    itemRows.forEach((row: any) => {
      if (Array.isArray(row) && row.length >= 2) {
        const oid = row[1]?.toString().trim();
        if (oid) {
          if (!itemsByOrder[oid]) itemsByOrder[oid] = [];
          itemsByOrder[oid].push({
            name: (row[2] || 'Unnamed Item').toString().trim(),
            size: (row[3] || 'N/A').toString().trim(),
            quantity: parseInt(row[4]) || 0,
            price: parseFloat(row[5]) || 0,
            total: parseFloat(row[6]) || 0,
          });
        }
      }
    });

    // Filter by Email and map
    const orders = orderRows
      .filter((row: any) => Array.isArray(row) && row.length >= 5 && row[4]?.toString().trim().toLowerCase() === email.toLowerCase())
      .map((row: any) => {
        const orderId = row[1]?.toString().trim() || 'N/A';
        return {
          date: row[0],
          id: orderId,
          customer: row[2] || 'Unknown',
          phone: row[3] || 'N/A',
          email: row[4] || 'N/A',
          address: row[5] || 'N/A',
          total: parseFloat(row[6]) || 0,
          payment: row[7] || 'N/A',
          status: (row[8] || 'Confirmed').toString().trim(),
          trackingId: row[9] || '',
          items: itemsByOrder[orderId] || [],
        };
      })
      .sort((a: any, b: any) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        if (isNaN(timeA) || isNaN(timeB)) return 0;
        return timeB - timeA;
      });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Fetch User Orders Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
