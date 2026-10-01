import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const seedInitialData = async () => {
  try {
    const defaultPasswordHash = await bcrypt.hash('KisanPass@2026', 10);

    // 1. Ensure Demo Users
    let ramesh = await User.findOne({ phone: '+91 98230 11223' });
    if (!ramesh) {
      ramesh = await User.create({
        name: 'Ramesh Patil',
        phone: '+91 98230 11223',
        email: 'ramesh.patil@kisanmail.in',
        password: defaultPasswordHash,
        role: 'farmer',
        location: {
          city: 'Pune',
          village: 'Shindewadi',
          coordinates: [73.8567, 18.5204],
        },
        farmDetails: {
          landSizeAcres: 4.5,
          cropsGrown: ['Fresh Desi Tomatoes', 'Hydroponic Spinach', 'A2 Gir Cow Milk', 'Alphonsos'],
          isVerified: true,
          certification: 'PGS-Green Certified',
        },
      });
    }

    let suresh = await User.findOne({ phone: '+91 97654 88712' });
    if (!suresh) {
      suresh = await User.create({
        name: 'Suresh Deshmukh',
        phone: '+91 97654 88712',
        email: 'suresh.baramati@gmail.com',
        password: defaultPasswordHash,
        role: 'farmer',
        location: {
          city: 'Pune',
          village: 'Baramati',
          coordinates: [74.5772, 18.1511],
        },
        farmDetails: {
          landSizeAcres: 2.0,
          cropsGrown: ['Nagpur Sweet Oranges', 'Organic Red Onions'],
          isVerified: false,
          certification: 'Under In-Transition Inspection',
        },
      });
    }

    let aditi = await User.findOne({ phone: '+91 99221 44556' });
    if (!aditi) {
      aditi = await User.create({
        name: 'Aditi Sharma',
        phone: '+91 99221 44556',
        email: 'aditi.sharma@techcorp.io',
        password: defaultPasswordHash,
        role: 'consumer',
        location: {
          city: 'Pune',
          societyName: 'Green Acres Residency',
          coordinates: [73.8052, 18.5074],
        },
      });
    }

    let admin = await User.findOne({ phone: '+91 20 2553 4100' });
    if (!admin) {
      admin = await User.create({
        name: 'District Agriculture Desk',
        phone: '+91 20 2553 4100',
        email: 'agridirect.pune@mahagov.in',
        password: defaultPasswordHash,
        role: 'admin',
        location: {
          city: 'Pune',
          coordinates: [73.8567, 18.5204],
        },
      });
    }

    // 2. Ensure Products
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      const productsToSeed = [
        {
          farmer: ramesh._id,
          name: 'Fresh Desi Tomatoes',
          category: 'Vegetables',
          imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
          directPrice: 28,
          mandiPrice: 18,
          retailBenchmark: 42,
          stockQuantity: 140,
          unit: 'kg',
          stockStatus: 'In Stock',
          isOrganic: true,
          harvestTimestamp: new Date(Date.now() - 3 * 3600 * 1000),
          location: {
            village: 'Shindewadi',
            district: 'Pune',
            coordinates: [73.8567, 18.5204],
          },
        },
        {
          farmer: suresh._id,
          name: 'Nagpur Sweet Oranges',
          category: 'Fruits',
          imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=900&q=80',
          directPrice: 58,
          mandiPrice: 35,
          retailBenchmark: 85,
          stockQuantity: 220,
          unit: 'kg',
          stockStatus: 'In Stock',
          isOrganic: false,
          harvestTimestamp: new Date(Date.now() - 14 * 3600 * 1000),
          location: {
            village: 'Baramati',
            district: 'Pune',
            coordinates: [74.5772, 18.1511],
          },
        },
        {
          farmer: ramesh._id,
          name: 'Hydroponic Spinach',
          category: 'Leafy Greens',
          imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80',
          directPrice: 38,
          mandiPrice: 22,
          retailBenchmark: 60,
          stockQuantity: 35,
          unit: 'kg',
          stockStatus: 'Low Stock',
          isOrganic: true,
          harvestTimestamp: new Date(Date.now() - 2 * 3600 * 1000),
          location: {
            village: 'Shindewadi',
            district: 'Pune',
            coordinates: [73.8567, 18.5204],
          },
        },
        {
          farmer: ramesh._id,
          name: 'Alphonsos (Pre-Harvest Booking)',
          category: 'Fruits',
          imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80',
          directPrice: 550,
          mandiPrice: 380,
          retailBenchmark: 800,
          stockQuantity: 45,
          unit: 'kg',
          stockStatus: 'Low Stock',
          isOrganic: true,
          harvestTimestamp: new Date(),
          location: {
            village: 'Shindewadi',
            district: 'Pune',
            coordinates: [73.8567, 18.5204],
          },
        },
        {
          farmer: ramesh._id,
          name: 'Farm-Fresh A2 Gir Cow Milk',
          category: 'Dairy & Livestock',
          imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',
          directPrice: 75,
          mandiPrice: 45,
          retailBenchmark: 110,
          stockQuantity: 60,
          unit: 'litre',
          stockStatus: 'In Stock',
          isOrganic: true,
          harvestTimestamp: new Date(Date.now() - 4 * 3600 * 1000),
          location: {
            village: 'Shindewadi',
            district: 'Pune',
            coordinates: [73.8567, 18.5204],
          },
        },
        {
          farmer: suresh._id,
          name: 'Organic Red Onions',
          category: 'Vegetables',
          imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80',
          directPrice: 24,
          mandiPrice: 14,
          retailBenchmark: 38,
          stockQuantity: 350,
          unit: 'kg',
          stockStatus: 'In Stock',
          isOrganic: true,
          harvestTimestamp: new Date(Date.now() - 24 * 3600 * 1000),
          location: {
            village: 'Baramati',
            district: 'Pune',
            coordinates: [74.5772, 18.1511],
          },
        },
        {
          farmer: ramesh._id,
          name: 'Organic Sweet Bell Peppers',
          category: 'Vegetables',
          imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800',
          directPrice: 54,
          mandiPrice: 35,
          retailBenchmark: 85,
          stockQuantity: 90,
          unit: 'kg',
          stockStatus: 'In Stock',
          isOrganic: true,
          harvestTimestamp: new Date(Date.now() - 2 * 3600 * 1000),
          location: {
            village: 'Shindewadi',
            district: 'Pune',
            coordinates: [73.8567, 18.5204],
          },
        },
      ];

      await Product.insertMany(productsToSeed);
      console.log('✅ Initial produce items seeded into MongoDB.');
    }
  } catch (error) {
    console.error('Database Seed Error:', error.message);
  }
};
