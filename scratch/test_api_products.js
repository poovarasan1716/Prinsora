async function testProducts() {
  console.log('Testing /api/products...');
  try {
    const res = await fetch('http://localhost:4028/api/products');
    const data = await res.json();
    console.log('Success! Product count:', data.products?.length);
    if (data.products?.length > 0) {
      console.log('First product:', data.products[0].name);
    } else {
      console.log('No products returned.');
    }
  } catch (e) {
    console.error('Fetch failed:', e.message);
  }
}

testProducts();
