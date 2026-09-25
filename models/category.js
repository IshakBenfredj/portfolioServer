const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['skills', 'products', 'lessons', 'portfolio'],
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameAr: {
      type: String,
      default: '',
      trim: true,
    },
    nameFr: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: '',
      trim: true,
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index for type and key
categorySchema.index({ type: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
