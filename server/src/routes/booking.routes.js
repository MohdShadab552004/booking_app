const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// POST /api/bookings - Create new booking
router.post('/',
  body('experienceId').isMongoId(),
  body('slotId').isMongoId(),
  body('userInfo.name').trim().isLength({ min: 2 }),
  body('userInfo.email').isEmail(),
  body('participants').isInt({ min: 1 }),
  bookingController.createBooking
);

// POST /api/bookings/validate-promo - Validate promo code
router.post('/validate-promo',
  body('code').trim().isLength({ min: 1 }),
  body('totalAmount').isFloat({ min: 0 }),
  bookingController.validatePromo
);

// GET /api/bookings/:id - Get booking details
router.get('/:id',
  body('id').isMongoId(),
  bookingController.getBooking
);

module.exports = router;