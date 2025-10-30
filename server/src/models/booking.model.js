const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  participants: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  promoCode: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Compound index to help prevent double bookings
bookingSchema.index(
  { experienceId: 1, slotId: 1, 'userInfo.email': 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } } }
);

module.exports = mongoose.model('Booking', bookingSchema);