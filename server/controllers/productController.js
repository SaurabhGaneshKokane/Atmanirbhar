import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Haversine formula to compute distance in km between two [lng, lat] pairs
const calculateDistanceKm = (coords1, coords2) => {
  if (!coords1 || !coords2 || coords1.length < 2 || coords2.length < 2) return 4.2; // default fallback
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};

// @route   GET /api/products
// @desc    Get all marketplace products with distance, category & freshness filters
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, maxDistance, maxDistanceKm, freshness, hours, search, lng, lat } = req.query;

    const query = {};

    // 1. Category filter
    if (category && category !== 'All' && category !== 'All Produce') {
      if (category === 'Farm Vegetables') {
        query.category = { $in: ['Vegetables', 'Leafy Greens'] };
      } else if (category === 'Orchard Fruits') {
        query.category = 'Fruits';
      } else if (category === 'Dairy & Cold-Pressed') {
        query.category = 'Dairy & Livestock';
      } else {
        query.category = category;
      }
    }

    // 2. Freshness filter (< 12 or 24 hours)
    const freshHours = Number(freshness || hours);
    if (freshHours && !isNaN(freshHours)) {
      const thresholdDate = new Date(Date.now() - freshHours * 3600 * 1000);
      query.harvestTimestamp = { $gte: thresholdDate };
    }

    // 3. Search query
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Fetch products and populate farmer
    const products = await Product.find(query)
      .populate('farmer', 'name phone email location farmDetails')
      .sort({ createdAt: -1 });

    // User reference coordinate (defaults to Kothrud Pune [73.8052, 18.5074] if not specified)
    const userCoords = lng && lat ? [Number(lng), Number(lat)] : [73.8052, 18.5074];

    // Compute distance and apply maxDistanceKm filter
    const maxRadius = Number(maxDistance || maxDistanceKm);

    const enrichedProducts = products
      .map((product) => {
        const prodObj = product.toObject();
        const farmCoords = prodObj.location?.coordinates || prodObj.farmer?.location?.coordinates || [73.8567, 18.5204];
        const distanceKm = calculateDistanceKm(userCoords, farmCoords);

        return {
          ...prodObj,
          distanceKm,
          farmerName: prodObj.farmer?.name || 'Verified Kisan',
          isVerifiedFarmer: Boolean(prodObj.farmer?.farmDetails?.isVerified),
        };
      })
      .filter((p) => {
        if (maxRadius && !isNaN(maxRadius)) {
          return p.distanceKm <= maxRadius;
        }
        return true;
      });

    res.json({
      success: true,
      count: enrichedProducts.length,
      data: enrichedProducts,
    });
  } catch (error) {
    console.error('getProducts Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching marketplace products.',
    });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'farmer',
      'name phone email location farmDetails'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product details.',
    });
  }
};

// @route   POST /api/products
// @desc    Farmer publish new harvest batch
// @access  Private (Farmer only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      imageUrl,
      directPrice,
      directPricePerKg,
      mandiPrice,
      mandiPricePerKg,
      retailBenchmark,
      consumerRetailPrice,
      stockQuantity,
      quantityAvailable,
      unit,
      isOrganic,
      harvestTimestamp,
      location,
    } = req.body;

    const finalDirectPrice = Number(directPrice || directPricePerKg);
    const finalMandiPrice = Number(mandiPrice || mandiPricePerKg || Math.round(finalDirectPrice * 0.65));
    const finalRetailPrice = Number(retailBenchmark || consumerRetailPrice || Math.round(finalDirectPrice * 1.45));
    const finalStockQty = Number(stockQuantity || quantityAvailable || 50);

    const product = await Product.create({
      farmer: req.user._id,
      name: name.trim(),
      category: category || 'Vegetables',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
      directPrice: finalDirectPrice,
      mandiPrice: finalMandiPrice,
      retailBenchmark: finalRetailPrice,
      stockQuantity: finalStockQty,
      unit: unit || 'kg',
      stockStatus: finalStockQty > 0 ? 'In Stock' : 'Sold Out',
      isOrganic: isOrganic !== undefined ? isOrganic : true,
      harvestTimestamp: harvestTimestamp || new Date(),
      location: location || {
        village: req.user.location?.village || 'Pune Rural',
        district: 'Pune',
        coordinates: req.user.location?.coordinates || [73.8567, 18.5204],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Harvest batch published successfully!',
      data: product,
    });
  } catch (error) {
    console.error('createProduct Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating harvest listing.',
    });
  }
};

// @route   PATCH /api/products/:id/stock
// @desc    1-Click toggle stock status (In Stock / Sold Out)
// @access  Private (Farmer only)
export const toggleStockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockStatus, stockQuantity } = req.body;

    const isValidId = id && mongoose.Types.ObjectId.isValid(id);
    const product = isValidId ? await Product.findById(id) : await Product.findOne();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    // Verify ownership
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not own this harvest listing.',
      });
    }

    if (stockStatus) {
      product.stockStatus = stockStatus;
    } else {
      // Toggle
      product.stockStatus = product.stockStatus === 'In Stock' ? 'Sold Out' : 'In Stock';
    }

    if (stockQuantity !== undefined) {
      product.stockQuantity = Number(stockQuantity);
    }

    await product.save();

    res.json({
      success: true,
      message: `Stock status updated to "${product.stockStatus}"`,
      data: product,
    });
  } catch (error) {
    console.error('toggleStockStatus Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating stock status.',
    });
  }
};
