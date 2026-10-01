import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a user full name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a mobile phone number'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure password'],
    },
    role: {
      type: String,
      enum: ['consumer', 'farmer', 'admin'],
      default: 'consumer',
    },
    location: {
      city: {
        type: String,
        default: 'Pune',
      },
      societyName: {
        type: String,
        trim: true,
      },
      village: {
        type: String,
        trim: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
    },
    farmDetails: {
      landSizeAcres: {
        type: Number,
      },
      cropsGrown: {
        type: [String],
        default: [],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      certification: {
        type: String,
        default: 'PGS-Green Certified',
      },
      documentUrl: {
        type: String,
      },
      documentName: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
