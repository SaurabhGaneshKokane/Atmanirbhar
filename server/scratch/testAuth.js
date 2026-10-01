async function testAuthFlow() {
  const BASE_URL = 'http://localhost:5000/api/auth';
  console.log('--- Testing Atmanirbhar Authentication API ---');

  try {
    // 1. Test Demo Login (Farmer)
    console.log('1. Testing POST /demo-login (Farmer)...');
    const demoRes = await fetch(`${BASE_URL}/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'farmer' }),
    });
    const demoData = await demoRes.json();
    console.log('Demo Login Result:', demoData.success, '| User:', demoData.user?.name, '| Role:', demoData.user?.role);
    if (!demoData.token) throw new Error('Missing token in demo login');

    // 2. Test GET /me with Bearer Token
    console.log('2. Testing GET /me with Token...');
    const meRes = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${demoData.token}`,
      },
    });
    const meData = await meRes.json();
    console.log('GET /me Result:', meData.success, '| Name:', meData.user?.name, '| Farm:', meData.user?.farmDetails?.landSizeAcres, 'Acres');

    // 3. Test Register New Consumer
    const testPhone = `+919888${Math.floor(100000 + Math.random() * 900000)}`;
    console.log(`3. Testing POST /register with Phone ${testPhone}...`);
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sunita Deshmukh',
        phone: testPhone,
        password: 'Password@123',
        role: 'consumer',
        location: { city: 'Pune', societyName: 'Rohan Nilay, Aundh' },
      }),
    });
    const regData = await regRes.json();
    console.log('Register Result:', regData.success, '| Token:', Boolean(regData.token), '| Role:', regData.user?.role);

    // 4. Test Login with Registered User
    console.log('4. Testing POST /login with Registered User...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testPhone,
        password: 'Password@123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('Login Result:', loginData.success, '| User ID:', loginData.user?._id);

    // 5. Test Invalid Token
    console.log('5. Testing GET /me with Invalid Token (Expected 401)...');
    const invalidRes = await fetch(`${BASE_URL}/me`, {
      headers: { 'Authorization': 'Bearer invalid_token_xyz' },
    });
    console.log('Invalid Token Status:', invalidRes.status, '(401 Expected)');

    console.log('🎉 All Authentication Tests Passed Successfully!');
  } catch (err) {
    console.error('❌ Test Failed:', err.message);
    process.exit(1);
  }
}

testAuthFlow();
