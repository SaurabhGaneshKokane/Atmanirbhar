import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a registered farmer'],
    },
    name: {
      type: String,
      required: [true, 'Please provide produce / harvest name'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Vegetables', 'Fruits', 'Leafy Greens', 'Dairy & Livestock'],
      required: [true, 'Please specify a produce category'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide high-resolution produce image URL'],
    },
    directPrice: {
      type: Number,
      required: [true, 'Please specify the farmer direct price per unit'],
      min: [0, 'Direct price cannot be negative'],
    },
    mandiPrice: {
      type: Number,
      required: [true, 'Please specify the APMC mandi benchmark rate'],
      min: [0, 'Mandi price cannot be negative'],
    },
    retailBenchmark: {
      type: Number,
      required: [true, 'Please specify the supermarket retail benchmark rate'],
      min: [0, 'Retail benchmark cannot be negative'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Please specify available stock quantity'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      enum: ['kg', 'litre', 'bunch', 'crate'],
      default: 'kg',
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Sold Out'],
      default: 'In Stock',
    },
    harvestTimestamp: {
      type: Date,
      default: Date.now,
    },
    isOrganic: {
      type: Boolean,
      default: true,
    },
    location: {
      village: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        default: 'Pune',
        trim: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
