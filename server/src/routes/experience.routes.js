const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const experienceController = require('../controllers/experience.controller');

// GET /api/experiences - List all experiences
router.get('/', experienceController.listExperiences);

// GET /api/experiences/:id - Get experience details with slots
router.get('/:id', 
  param('id').isMongoId(),
  experienceController.getExperienceById
);

// POST /api/experiences/check-slot - Check slot availability
router.post('/check-slot',
  body('experienceId').isMongoId(),
  body('slotId').isMongoId(),
  body('participants').isInt({ min: 1 }),
  experienceController.checkSlotAvailability
);

module.exports = router;