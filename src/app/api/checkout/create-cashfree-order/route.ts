import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, customerId, customerName, customerEmail, customerPhone } = await req.json();

    const appId = process.env.CASHFREE_APP_ID || 'TEST104712419266a83d3170d1059f147401'; // Placeholder test ID
    const secretKey = process.env.CASHFREE_SECRET_KEY || 'TEST17a0d4c1f6c8d9e0b1c2d3e4f5a6b7c8d9e0'; // Placeholder test secret

    const response = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey,
      },
      body: JSON.stringify({
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: customerId || 'guest_' + Date.now(),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${req.nextUrl.origin}/checkout?order_id={order_id}`,
        },
      }),
    });

    const result = await response.json();

    if (result.payment_session_id) {
      return NextResponse.json({
        success: true,
        paymentSessionId: result.payment_session_id,
        orderId: result.order_id,
      });
    } else {
      console.error('Cashfree API Error Response:', result);
      return NextResponse.json(
        {
          success: false,
          error: result.message || result.code || 'Failed to create Cashfree order',
          details: result,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Cashfree Order Creation Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
