import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a registered consumer'],
    },
    societyName: {
      type: String,
      required: [true, 'Please provide target society or drop location'],
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one harvest item'],
      validate: [
        (items) => items && items.length > 0,
        'Order cannot be empty',
      ],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please specify total order amount'],
      min: [0, 'Total amount cannot be negative'],
    },
    totalSavings: {
      type: Number,
      required: [true, 'Please specify total savings vs supermarket retail'],
      min: [0, 'Savings amount cannot be negative'],
      default: 0,
    },
    deliveryType: {
      type: String,
      enum: ['Society Drop', 'Farm Pickup'],
      default: 'Society Drop',
    },
    deliveryBatch: {
      type: String,
      default: 'Morning Drop (7:30 AM)',
    },
    status: {
      type: String,
      enum: [
        'Pending Confirmation',
        'Packed & Ready',
        'Out for Society Drop',
        'Delivered',
      ],
      default: 'Pending Confirmation',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
