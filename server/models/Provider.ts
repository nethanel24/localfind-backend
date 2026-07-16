import mongoose from "mongoose";

const Schema = mongoose.Schema;

const providerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: 0,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: [true, "Location coordinates are required"],
    },
  },
  openness: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { timestamps: true });

providerSchema.index({ location: "2dsphere" });

const providerModel = mongoose.model("Provider", providerSchema);

export default providerModel;