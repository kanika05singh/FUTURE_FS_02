const mongoose = require('mongoose');

const STATUS_VALUES = ['New', 'Contacted', 'Converted'];
const SOURCE_VALUES = ['Website', 'LinkedIn', 'Referral', 'Advertisement', 'Email', 'Other'];

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Note cannot exceed 1000 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number looks too long'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters'],
    },
    source: {
      type: String,
      enum: { values: SOURCE_VALUES, message: '{VALUE} is not a valid source' },
      default: 'Other',
    },
    status: {
      type: String,
      enum: { values: STATUS_VALUES, message: '{VALUE} is not a valid status' },
      default: 'New',
    },
    notes: {
      type: [noteSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Speeds up search-by-field and the dashboard's status aggregation
leadSchema.index({ name: 'text', email: 'text', company: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

leadSchema.statics.STATUS_VALUES = STATUS_VALUES;
leadSchema.statics.SOURCE_VALUES = SOURCE_VALUES;

module.exports = mongoose.model('Lead', leadSchema);
