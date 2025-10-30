const Experience = require('../models/experience.model');
const { validationResult } = require('express-validator');

// List all experiences with basic info
exports.listExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .select('title description image price location category rating reviewCount')
      .sort('-createdAt');

    res.json({
      success: true,
      data: experiences
    });
  } catch (error) {
    console.error('Error listing experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences',
      error: error.message
    });
  }
};

// Get single experience with available slots
exports.getExperienceById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Only filter out past slots, but keep sold out slots
    const now = new Date();
    experience.slots = experience.slots.filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate > now; // Only remove past slots, keep sold out slots
    });

    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experience',
      error: error.message
    });
  }
};

// Check slot availability
exports.checkSlotAvailability = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { experienceId, slotId, participants = 1 } = req.body;

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

    // Check if slot is in the past
    if (new Date(slot.date) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This slot is in the past'
      });
    }

    const availableSpots = slot.maxParticipants - slot.bookedParticipants;
    const isAvailable = slot.isAvailable && availableSpots >= participants;

    res.json({
      success: true,
      data: {
        isAvailable,
        availableSpots,
        maxParticipants: slot.maxParticipants,
        bookedParticipants: slot.bookedParticipants
      }
    });
  } catch (error) {
    console.error('Error checking slot availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};