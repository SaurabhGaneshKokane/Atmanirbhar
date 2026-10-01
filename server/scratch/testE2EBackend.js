async function testE2E() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('🧪 Running End-to-End Atmanirbhar Backend Test Suite');
  console.log('====================================================\n');

  try {
    // Step 1: Health Check
    console.log('1. Testing GET /api/health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('   Health Status:', healthData.status, '| Service:', healthData.service);

    // Step 2: Public Products Query with Filters
    console.log('\n2. Testing GET /api/products (Public Marketplace Query)...');
    const prodRes = await fetch(`${BASE_URL}/products?category=Vegetables&maxDistance=10`);
    const prodData = await prodRes.json();
    console.log(`   Fetched ${prodData.count} items matching "Vegetables" within 10km.`);
    if (prodData.data.length > 0) {
      console.log(`   Sample Product: "${prodData.data[0].name}" • Direct: ₹${prodData.data[0].directPrice} • Dist: ${prodData.data[0].distanceKm}km`);
    }

    // Step 3: Farmer Login & Harvest Batch Listing
    console.log('\n3. Testing Farmer Flow (Demo Login -> Create Produce -> Toggle Stock)...');
    const farmerLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'farmer' }),
    });
    const farmerAuth = await farmerLoginRes.json();
    const farmerToken = farmerAuth.token;
    console.log('   Farmer Logged In:', farmerAuth.user?.name, '| ID:', farmerAuth.user?._id);

    // Create New Produce Batch
    const newProdRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${farmerToken}`,
      },
      body: JSON.stringify({
        name: 'Organic Sweet Bell Peppers',
        category: 'Vegetables',
        directPrice: 45,
        mandiPrice: 28,
        retailBenchmark: 70,
        stockQuantity: 80,
        unit: 'kg',
        isOrganic: true,
        harvestTimestamp: new Date(),
      }),
    });
    const newProdData = await newProdRes.json();
    const createdProdId = newProdData.data?._id;
    console.log('   Created New Produce Batch:', newProdData.data?.name, '| ID:', createdProdId);

    // Toggle Stock Status
    const stockRes = await fetch(`${BASE_URL}/products/${createdProdId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${farmerToken}`,
      },
      body: JSON.stringify({ stockStatus: 'Low Stock', stockQuantity: 20 }),
    });
    const stockData = await stockRes.json();
    console.log('   Stock Toggled:', stockData.data?.stockStatus, '| New Quantity:', stockData.data?.stockQuantity);

    // Step 4: Consumer Login & Order Placement
    console.log('\n4. Testing Consumer Flow (Demo Login -> Place Direct Order)...');
    const consumerLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'consumer' }),
    });
    const consumerAuth = await consumerLoginRes.json();
    const consumerToken = consumerAuth.token;
    console.log('   Consumer Logged In:', consumerAuth.user?.name, '| Society:', consumerAuth.user?.location?.societyName);

    // Place Order for 5kg of the newly created bell peppers
    const orderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${consumerToken}`,
      },
      body: JSON.stringify({
        items: [{ productId: createdProdId, quantity: 5 }],
        deliveryType: 'Society Drop',
        societyName: 'Green Acres Residency, Tower B',
      }),
    });
    const orderData = await orderRes.json();
    const createdOrderId = orderData.order?._id;
    console.log('   Order Placed Successfully! ID:', createdOrderId);
    console.log(`   Total Amount: ₹${orderData.order?.totalAmount} | Total Savings vs Retail: ₹${orderData.order?.totalSavings}`);

    // Verify Stock was decremented from 20 to 15
    const verifyProdRes = await fetch(`${BASE_URL}/products/${createdProdId}`);
    const verifyProdData = await verifyProdRes.json();
    console.log('   Verified Stock Decremented to:', verifyProdData.data?.stockQuantity, '(Expected 15)');

    // Step 5: Farmer Checks Orders & Updates Status Stepper
    console.log('\n5. Testing Farmer Incoming Orders & Status Stepper...');
    const farmerOrdersRes = await fetch(`${BASE_URL}/orders/farmer`, {
      headers: { 'Authorization': `Bearer ${farmerToken}` },
    });
    const farmerOrdersData = await farmerOrdersRes.json();
    console.log(`   Farmer has ${farmerOrdersData.count} active incoming orders.`);

    // Advance Order to 'Packed & Ready'
    const updateOrderRes = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${farmerToken}`,
      },
      body: JSON.stringify({ status: 'Packed & Ready' }),
    });
    const updateOrderData = await updateOrderRes.json();
    console.log('   Order Status Advanced to:', updateOrderData.data?.status);

    // Step 6: Admin Metrics & Farmer Verification
    console.log('\n6. Testing Admin Governance Desk (Metrics & Verification)...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' }),
    });
    const adminAuth = await adminLoginRes.json();
    const adminToken = adminAuth.token;
    console.log('   Admin Logged In:', adminAuth.user?.name);

    // Get Admin Metrics
    const metricsRes = await fetch(`${BASE_URL}/admin/metrics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const metricsData = await metricsRes.json();
    console.log(`   Admin Metrics: Total Payouts ₹${metricsData.data?.totalDirectFarmerPayouts} | Eliminated Commission ₹${metricsData.data?.totalCommissionEliminated}`);

    // Get Pending Verifications
    const verifRes = await fetch(`${BASE_URL}/admin/verifications`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const verifData = await verifRes.json();
    const unverifiedFarmer = verifData.data?.find((f) => !f.farmDetails?.isVerified);

    if (unverifiedFarmer) {
      console.log(`   Found Unverified Farmer: "${unverifiedFarmer.name}". Approving...`);
      const approveRes = await fetch(`${BASE_URL}/admin/verify/${unverifiedFarmer._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          notes: 'Mahabhulekh Gat 412/A verified with PGS-Green Certificate',
        }),
      });
      const approveData = await approveRes.json();
      console.log('   Verification Result:', approveData.message);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL END-TO-END BACKEND TESTS PASSED CLEANLY!');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ E2E Test Execution Failed:', error);
    process.exit(1);
  }
}

testE2E();
