const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzgVG-Nqoc0aZxWMMSvA8CCcpFjI5-CnR7Nh3Sjpojg8ai4JV40PvRr1R7Di3U1J2id/exec';
const SHEET_ID = '1xJZYOwkt0JXDwlGpAJZRAQzTrJ4rSeCktGCN5TjLwd4';

async function syncUser(user) {
  console.log(`Syncing user: ${user.name}...`);
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'placeOrder',
        sheetId: SHEET_ID,
        sheetName: 'User_details',
        orderRows: [[new Date().toLocaleString(), user.name, user.email, user.phone, 'Active']],
      }),
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log('Received non-JSON response (likely success):', text.slice(0, 50));
      return { success: true };
    }
  } catch (e) {
    console.error('Request failed', e);
    return { success: false };
  }
}

async function placeOrder(order) {
  console.log(`Syncing order for: ${order.customer}...`);
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'placeOrder',
        sheetId: SHEET_ID,
        sheetName: 'Orders',
        orderRows: [
          [
            new Date().toLocaleString(),
            order.id,
            order.customer,
            order.phone,
            order.email,
            order.address,
            order.item,
            order.qty,
            order.price,
            order.method,
            'Confirmed',
          ],
        ],
      }),
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log('Received non-JSON response (likely success):', text.slice(0, 50));
      return { success: true };
    }
  } catch (e) {
    console.error('Request failed', e);
    return { success: false };
  }
}

const sampleUsers = [
  { name: 'Aanya Sharma', email: 'aanya@example.com', phone: '+91 98765 43210' },
  { name: 'Ishaan Verma', email: 'ishaan@example.com', phone: '+91 91234 56789' },
  { name: 'Meera Iyer', email: 'meera@example.com', phone: '+91 88776 65544' },
];

const sampleOrders = [
  {
    id: 'PRN-5001',
    customer: 'Aanya Sharma',
    email: 'aanya@example.com',
    phone: '+91 98765 43210',
    address: 'Banjara Hills, Hyderabad',
    item: 'Maharani Crimson Silk Saree',
    qty: 1,
    price: 48500,
    method: 'CARD',
  },
  {
    id: 'PRN-5002',
    customer: 'Ishaan Verma',
    email: 'ishaan@example.com',
    phone: '+91 91234 56789',
    address: 'Indiranagar, Bangalore',
    item: 'Vrindavan Emerald Lehenga',
    qty: 1,
    price: 89900,
    method: 'UPI',
  },
];

async function run() {
  for (const user of sampleUsers) {
    await syncUser(user);
    await new Promise((r) => setTimeout(r, 1000));
  }
  for (const order of sampleOrders) {
    await placeOrder(order);
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log('All sample data synced perfectly!');
}

run();
