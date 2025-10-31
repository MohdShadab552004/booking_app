const Booking = require('../models/booking.model');
const Experience = require('../models/experience.model');
const { validationResult } = require('express-validator');
const { validateAndApplyPromo } = require('../utils/helper');


// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { experienceId, slotId, userInfo, participants, promoCode } = req.body;

    // Check if experience exists and get slot details
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    const slot = experience.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    // Check slot availability
    if (!slot.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This slot is not available'
      });
    }

    // Check if slot is in the past
    if (new Date(slot.date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This slot is in the past'
      });
    }

    // Check if enough spots are available
    const availableSpots = slot.maxParticipants - slot.bookedParticipants;
    if (availableSpots < participants) {
      return res.status(400).json({
        success: false,
        message: 'Not enough spots available'
      });
    }

    // Calculate pricing
    const baseAmount = experience.price * participants;
    let discountAmount = 0;
    let finalAmount = baseAmount;

    // Apply promo code if provided
    if (promoCode) {
      const promoResult = await validateAndApplyPromo(promoCode, baseAmount);
      if (!promoResult.valid) {
        return res.status(400).json({
          success: false,
          message: promoResult.message
        });
      }
      discountAmount = promoResult.discountAmount;
      finalAmount = promoResult.finalAmount;
    }

    // Create booking - this will throw if duplicate due to unique index
    const booking = await Booking.create({
      experienceId,
      slotId,
      userInfo,
      participants,
      totalAmount: baseAmount,
      discountAmount,
      finalAmount,
      promoCode,
      status: 'confirmed'
    });

    // Update slot availability atomically
    const updatedExperience = await Experience.findOneAndUpdate(
      {
        _id: experienceId,
        'slots._id': slotId,
        'slots.bookedParticipants': { $lte: slot.maxParticipants - participants }
      },
      {
        $inc: { 'slots.$.bookedParticipants': participants },
        $set: {
          'slots.$.isAvailable': slot.maxParticipants - (slot.bookedParticipants + participants) > 0
        }
      },
      { new: true }
    );

    if (!updatedExperience) {
      // If update fails, remove booking and return error
      await Booking.findByIdAndDelete(booking._id);
      return res.status(400).json({
        success: false,
        message: 'Slot is no longer available'
      });
    }

    // Return created booking
    res.status(201).json({
      success: true,
      data: await Booking.findById(booking._id)
        .populate('experienceId', 'title image location')
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this slot'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Validate promo code
exports.validatePromo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { code, totalAmount } = req.body;
    const result = await validateAndApplyPromo(code, totalAmount);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      data: {
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
        discountType: result.discountType,
        discountValue: result.discountValue
      }
    });

  } catch (error) {
    console.error('Error validating promo:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating promo code',
      error: error.message
    });
  }
};

// Get booking details
exports.getBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('experienceId', 'title image location duration');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};
