/**
 * Atmanirbhar Data Store & Mock Fixtures
 * Direct-to-Consumer / Direct-to-Society Fair Agriculture Trade Platform
 */

export const users = {
  farmer: {
    id: "usr_farmer_01",
    name: "Ramesh Patil",
    role: "FARMER",
    phone: "+91 98230 11223",
    email: "ramesh.patil@kisanmail.in",
    avatar: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80",
    village: "Shindewadi",
    district: "Pune",
    state: "Maharashtra",
    farmDetails: {
      name: "Patil Organic Farmsteads",
      size: "4.5 Acres",
      farmingType: "Certified Organic & ZBNF",
      established: "2016",
      certifications: ["NPOP Organic Certified", "PGS-India Green"],
    },
    verified: true,
    verificationBadgeDate: "2024-03-15",
    bankAccountLinked: true,
    upiId: "rameshpatil@oksbi",
    rating: 4.9,
    totalOrdersFulfilled: 342,
    cooperativeSociety: "Sahyadri Agro Federation",
  },

  unverifiedFarmer: {
    id: "usr_farmer_02",
    name: "Suresh Deshmukh",
    role: "FARMER",
    phone: "+91 97654 88712",
    email: "suresh.baramati@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    village: "Baramati",
    district: "Pune",
    state: "Maharashtra",
    farmDetails: {
      name: "Deshmukh Natural Orchards",
      size: "2.0 Acres",
      farmingType: "Integrated Pest Management (Chemical Free)",
      established: "2021",
      certifications: ["Under In-Transition Inspection"],
    },
    verified: false,
    verificationStatus: "Pending Admin Document Verification",
    bankAccountLinked: true,
    upiId: "suresh.d@icici",
    rating: 4.5,
    totalOrdersFulfilled: 18,
    cooperativeSociety: "Baramati Kisan Sangathan",
  },

  consumer: {
    id: "usr_consumer_01",
    name: "Aditi Sharma",
    role: "CONSUMER",
    phone: "+91 99221 44556",
    email: "aditi.sharma@techcorp.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    location: "Kothrud, Pune",
    society: "Green Acres Residency",
    flatNumber: "Tower B, Flat 804",
    societyAdminContact: "+91 98811 00992",
    societyBulkDropActive: true,
    preferredPickupTime: "7:30 AM - 9:00 AM",
    savedAddresses: [
      {
        id: "addr_1",
        label: "Home (Society Drop)",
        details: "B-804, Green Acres Residency, Paud Road, Kothrud, Pune - 411038",
        pincode: "411038"
      }
    ],
    loyaltyPoints: 480,
  },

  admin: {
    id: "usr_admin_01",
    name: "District Agriculture Desk",
    adminId: "ADM-PUNE-01",
    officerInCharge: "Dr. Arvind Kulkarni (Joint Director of Agronomy)",
    department: "District Agricultural Oversight & Direct Marketing Bureau",
    jurisdiction: "Pune Metropolitan & Rural Division",
    email: "agridirect.pune@mahagov.in",
    phone: "+91 20 2553 4100",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    activeAuditsCount: 14,
    mandiPriceSyncFrequency: "Every 4 Hours (APMC Pune Gateway)",
  }
};

export const products = [
  {
    id: "prod_01",
    farmerId: "usr_farmer_01",
    farmerName: "Ramesh Patil",
    name: "Fresh Desi Tomatoes",
    category: "Vegetables",
    description: "Naturally vine-ripened indigenous desi tomatoes with tangy rich flavor. Plucked at peak dawn coolness.",
    location: "Shindewadi, Pune",
    distanceKm: 4.2,
    harvestTime: "Harvested 3 hours ago",
    mandiPricePerKg: 18,
    directPricePerKg: 28,
    consumerRetailPrice: 42,
    quantityAvailable: 140,
    unit: "kg",
    isOrganic: true,
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
    stockStatus: "In Stock",
    tags: ["Dawn Plucked", "Heirloom Seed", "Pesticide Free"],
    grade: "Grade A Export Quality",
    shelfLifeDays: 5,
    minOrderQty: 1,
    maxOrderQty: 15,
  },
  {
    id: "prod_02",
    farmerId: "usr_farmer_02",
    farmerName: "Suresh Deshmukh",
    name: "Nagpur Sweet Oranges",
    category: "Fruits",
    description: "Juicy, thin-skinned Nagpur Santra directly sourced from pesticide-managed groves with sweet-citrus pulp.",
    location: "Baramati, Pune",
    distanceKm: 18.5,
    harvestTime: "Harvested yesterday evening",
    mandiPricePerKg: 35,
    directPricePerKg: 58,
    consumerRetailPrice: 85,
    quantityAvailable: 220,
    unit: "kg",
    isOrganic: false,
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=900&q=80",
    stockStatus: "In Stock",
    tags: ["High Vitamin C", "Table Fruit", "Zero Wax"],
    grade: "Table Grade Selected",
    shelfLifeDays: 8,
    minOrderQty: 2,
    maxOrderQty: 20,
  },
  {
    id: "prod_03",
    farmerId: "usr_farmer_01",
    farmerName: "Ramesh Patil",
    name: "Hydroponic Spinach",
    category: "Leafy Greens",
    description: "Crisp, soil-free nutrient-water cultivated baby palak leaves. Washed in purified RO mist, 100% grit-free.",
    location: "Shindewadi, Pune",
    distanceKm: 4.2,
    harvestTime: "Harvested 2 hours ago",
    mandiPricePerKg: 22,
    directPricePerKg: 38,
    consumerRetailPrice: 60,
    quantityAvailable: 35,
    unit: "kg",
    isOrganic: true,
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
    stockStatus: "Low Stock",
    tags: ["Hydroponic", "Ready to Eat", "Zero Residue"],
    grade: "Ultra-Clean Leaflet",
    shelfLifeDays: 3,
    minOrderQty: 1,
    maxOrderQty: 5,
  },
  {
    id: "prod_04",
    farmerId: "usr_farmer_01",
    farmerName: "Ramesh Patil",
    name: "Alphonsos (Pre-Harvest Booking)",
    category: "Premium Fruits",
    description: "Authentic Ratnagiri clone Hapus mangoes naturally tree-ripened without calcium carbide. Reserve your batch for weekend dispatch.",
    location: "Shindewadi / Konkan Grove",
    distanceKm: 8.0,
    harvestTime: "Pre-Order: Scheduled Harvest in 4 days",
    mandiPricePerKg: 380,
    directPricePerKg: 550,
    consumerRetailPrice: 800,
    quantityAvailable: 45,
    unit: "kg",
    isOrganic: true,
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80",
    stockStatus: "Low Stock",
    tags: ["GI Tag Certified", "Hay Cured", "Chemical Free"],
    grade: "GI Ratnagiri Grade A1 (250g+ per fruit)",
    shelfLifeDays: 7,
    minOrderQty: 2,
    maxOrderQty: 10,
  },
  {
    id: "prod_05",
    farmerId: "usr_farmer_01",
    farmerName: "Ramesh Patil",
    name: "Farm-Fresh A2 Gir Cow Milk",
    category: "Dairy & Livestock",
    description: "Pure unprocessed, single-origin morning milk from pasture-fed indigenous Gir cows. Chilled instantly to 4°C within 15 minutes.",
    location: "Shindewadi, Pune",
    distanceKm: 4.2,
    harvestTime: "Milked 4 hours ago (5:00 AM Batch)",
    mandiPricePerKg: 45,
    directPricePerKg: 75,
    consumerRetailPrice: 110,
    quantityAvailable: 60,
    unit: "litre",
    isOrganic: true,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
    stockStatus: "In Stock",
    tags: ["A2 Beta-Casein", "Glass Bottled", "Pasture Fed"],
    grade: "Raw Chilled Whole Milk",
    shelfLifeDays: 2,
    minOrderQty: 1,
    maxOrderQty: 6,
  },
  {
    id: "prod_06",
    farmerId: "usr_farmer_02",
    farmerName: "Suresh Deshmukh",
    name: "Organic Red Onions",
    category: "Staples & Roots",
    description: "Sun-cured pungent Nasik-variety red onions with high dry matter content, superior keeping quality and bold taste.",
    location: "Baramati, Pune",
    distanceKm: 18.5,
    harvestTime: "Harvested 2 days ago (Air Cured)",
    mandiPricePerKg: 14,
    directPricePerKg: 24,
    consumerRetailPrice: 38,
    quantityAvailable: 350,
    unit: "kg",
    isOrganic: true,
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80",
    stockStatus: "In Stock",
    tags: ["Long Shelf Life", "Solar Cured", "Direct Field"],
    grade: "Medium-Bold 55mm+",
    shelfLifeDays: 45,
    minOrderQty: 2,
    maxOrderQty: 25,
  },
  {
    id: "prod_07",
    farmerId: "usr_farmer_01",
    farmerName: "Ramesh Patil",
    name: "Organic Sweet Bell Peppers",
    category: "Vegetables",
    description: "Farm-fresh vibrant crunchy tricolor sweet bell peppers (capsicum) grown naturally without synthetic insecticides.",
    location: "Shindewadi, Pune",
    distanceKm: 4.2,
    harvestTime: "Picked this morning",
    mandiPricePerKg: 35,
    directPricePerKg: 54,
    consumerRetailPrice: 85,
    quantityAvailable: 90,
    unit: "kg",
    isOrganic: true,
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800",
    stockStatus: "In Stock",
    tags: ["Crisp & Sweet", "Zero Synthetic Sprays", "Direct Harvest"],
    grade: "Grade A Greenhouse",
    shelfLifeDays: 7,
    minOrderQty: 1,
    maxOrderQty: 10,
  }
];

export const orders = [
  {
    id: "ORD-2026-0814",
    consumerId: "usr_consumer_01",
    consumerName: "Aditi Sharma",
    consumerPhone: "+91 99221 44556",
    deliveryType: "Society Drop",
    deliveryLocation: "Green Acres Residency, Society Club Hub, Kothrud",
    slotTime: "Tomorrow, 7:30 AM - 9:00 AM",
    items: [
      {
        productId: "prod_01",
        productName: "Fresh Desi Tomatoes",
        quantity: 3,
        unit: "kg",
        pricePerUnit: 28,
        totalItemPrice: 84,
        farmerName: "Ramesh Patil"
      },
      {
        productId: "prod_03",
        productName: "Hydroponic Spinach",
        quantity: 2,
        unit: "kg",
        pricePerUnit: 38,
        totalItemPrice: 76,
        farmerName: "Ramesh Patil"
      },
      {
        productId: "prod_05",
        productName: "Farm-Fresh A2 Gir Cow Milk",
        quantity: 2,
        unit: "litre",
        pricePerUnit: 75,
        totalItemPrice: 150,
        farmerName: "Ramesh Patil"
      }
    ],
    itemSubtotal: 310,
    societyHubLogisticsFee: 15,
    farmerDirectSavingsVsRetail: 124, // Retail would have been 434
    totalAmount: 325,
    paymentStatus: "Paid via UPI",
    paymentRef: "UPI/260816/984321",
    status: "Pending Confirmation",
    createdAt: "2026-08-16T18:40:00+05:30",
    timeline: [
      { step: "Order Placed", time: "6:40 PM, Today", done: true },
      { step: "Farmer Batch Aggregation", time: "Pending", done: false },
      { step: "Morning Society Dispatch", time: "Scheduled 6:30 AM", done: false },
      { step: "Delivered to Society Locker", time: "Expected 7:45 AM", done: false }
    ]
  },
  {
    id: "ORD-2026-0811",
    consumerId: "usr_consumer_01",
    consumerName: "Aditi Sharma",
    consumerPhone: "+91 99221 44556",
    deliveryType: "Society Drop",
    deliveryLocation: "Green Acres Residency, Locker Bay C, Kothrud",
    slotTime: "Aug 15, 8:00 AM",
    items: [
      {
        productId: "prod_02",
        productName: "Nagpur Sweet Oranges",
        quantity: 5,
        unit: "kg",
        pricePerUnit: 58,
        totalItemPrice: 290,
        farmerName: "Suresh Deshmukh"
      },
      {
        productId: "prod_06",
        productName: "Organic Red Onions",
        quantity: 5,
        unit: "kg",
        pricePerUnit: 24,
        totalItemPrice: 120,
        farmerName: "Suresh Deshmukh"
      }
    ],
    itemSubtotal: 410,
    societyHubLogisticsFee: 15,
    farmerDirectSavingsVsRetail: 200,
    totalAmount: 425,
    paymentStatus: "Paid via UPI",
    paymentRef: "UPI/260815/120938",
    status: "Packed & Ready",
    createdAt: "2026-08-15T09:15:00+05:30",
    timeline: [
      { step: "Order Placed", time: "Aug 15, 9:15 AM", done: true },
      { step: "Farmer Batch Harvested & Packed", time: "Aug 15, 4:30 PM", done: true },
      { step: "Transit to Pune Hub", time: "Aug 16, 5:00 AM", done: true },
      { step: "Society Delivery", time: "Out for Morning Drop", done: false }
    ]
  },
  {
    id: "ORD-2026-0803",
    consumerId: "usr_consumer_01",
    consumerName: "Aditi Sharma",
    consumerPhone: "+91 99221 44556",
    deliveryType: "Farm Pickup",
    deliveryLocation: "Patil Organic Farmsteads, Shindewadi",
    slotTime: "Aug 12, 10:30 AM",
    items: [
      {
        productId: "prod_04",
        productName: "Alphonsos (Pre-Harvest Booking)",
        quantity: 2,
        unit: "kg",
        pricePerUnit: 550,
        totalItemPrice: 1100,
        farmerName: "Ramesh Patil"
      },
      {
        productId: "prod_01",
        productName: "Fresh Desi Tomatoes",
        quantity: 4,
        unit: "kg",
        pricePerUnit: 28,
        totalItemPrice: 112,
        farmerName: "Ramesh Patil"
      }
    ],
    itemSubtotal: 1212,
    societyHubLogisticsFee: 0,
    farmerDirectSavingsVsRetail: 556,
    totalAmount: 1212,
    paymentStatus: "Paid via UPI",
    paymentRef: "UPI/260812/771249",
    status: "Delivered",
    createdAt: "2026-08-11T14:20:00+05:30",
    deliveredAt: "2026-08-12T11:05:00+05:30",
    timeline: [
      { step: "Order Placed", time: "Aug 11, 2:20 PM", done: true },
      { step: "Box Prepared & Tagged", time: "Aug 12, 8:00 AM", done: true },
      { step: "Consumer Farm Visit & Pickup", time: "Aug 12, 11:05 AM", done: true },
      { step: "Delivered & Feedback Given", time: "Aug 12, 11:10 AM (5-Star Rating)", done: true }
    ]
  }
];

export const verificationRequests = [
  {
    id: "VR-PUNE-2026-042",
    applicantName: "Suresh Deshmukh",
    farmerUserId: "usr_farmer_02",
    phone: "+91 97654 88712",
    village: "Baramati",
    taluka: "Baramati",
    district: "Pune",
    farmName: "Deshmukh Natural Orchards",
    farmSizeAcres: 2.0,
    soilType: "Black Cotton & Medium Loam",
    waterSource: "Drip Irrigation via Nira River Canal & Borewell",
    landDocumentId: "7/12 Gat No. 412/A-Baramati",
    landDocStatus: "OCR Verified against Mahabhulekh Portal",
    applicationDate: "2026-08-10T11:30:00+05:30",
    status: "Under Officer Review",
    cropHistory: [
      { crop: "Nagpur Sweet Oranges (Santra)", area: "1.2 Acres", yieldMetricTons: "6.5 MT", chemicalUsage: "Zero chemical pesticides since 2023 (Neem oil & Dashaparni ark)" },
      { crop: "Nasik Red Onions (Garwa)", area: "0.8 Acres", yieldMetricTons: "7.0 MT", chemicalUsage: "Bio-fertilizers (Trichoderma + Jeevamrit)" }
    ],
    farmPhotos: [
      {
        title: "Main Orchard Canopy",
        url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
        geoTagged: "18.1511° N, 74.5772° E (Baramati)"
      },
      {
        title: "Drip Irrigation & Composting Bed",
        url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
        geoTagged: "18.1516° N, 74.5779° E (Baramati)"
      },
      {
        title: "Harvested Onions Curing Shed",
        url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
        geoTagged: "18.1509° N, 74.5768° E (Baramati)"
      }
    ],
    notesFromDesk: "Land records match title holder. Awaiting field coordinator geo-tag validation before issuing PGS Green certificate."
  },
  {
    id: "VR-PUNE-2026-051",
    applicantName: "Sunita Mahadev Khot",
    farmerUserId: "usr_farmer_03_temp",
    phone: "+91 94220 33418",
    village: "Saswad",
    taluka: "Purandar",
    district: "Pune",
    farmName: "Purandar Fig & Custard Apple Estate",
    farmSizeAcres: 3.2,
    soilType: "Rocky Red Loam & Well-Drained",
    waterSource: "Rainwater Farm Pond (Shet-tale) + Micro Jet Sprinklers",
    landDocumentId: "7/12 Gat No. 188/3-Saswad",
    landDocStatus: "OCR Pending Manual Signature Match",
    applicationDate: "2026-08-14T14:15:00+05:30",
    status: "Awaiting Field Visit",
    cropHistory: [
      { crop: "Purandar GI Figs (Anjeer)", area: "2.0 Acres", yieldMetricTons: "4.8 MT", chemicalUsage: "Natural cow dung slurry and vermicompost" },
      { crop: "Custard Apple (Sitaphal - Balanagar)", area: "1.2 Acres", yieldMetricTons: "3.2 MT", chemicalUsage: "Zero chemical inputs" }
    ],
    farmPhotos: [
      {
        title: "Terraced Fig Plantation",
        url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80",
        geoTagged: "18.3441° N, 74.0294° E (Saswad)"
      },
      {
        title: "Water Reservoir Pond",
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        geoTagged: "18.3447° N, 74.0289° E (Saswad)"
      }
    ],
    notesFromDesk: "GI Purandar Fig grower seeking direct society pre-booking channel. Scheduled field audit for Aug 20."
  }
];

export default {
  users,
  products,
  orders,
  verificationRequests
};
