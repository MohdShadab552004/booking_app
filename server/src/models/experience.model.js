const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  bookedParticipants: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  included: [{ type: String }],
  requirements: [{ type: String }],
  slots: [slotSchema]
}, {
  timestamps: true
});

// Add index on slots to help with availability queries
experienceSchema.index({ 'slots.date': 1, 'slots.isAvailable': 1 });

module.exports = mongoose.model('Experience', experienceSchema);