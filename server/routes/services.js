import express from 'express';

const router = express.Router();

// Service catalog with prices
const services = [
  {
    id: 'haircut',
    name: 'Classic Haircut',
    description: 'Professional haircut with styling',
    duration: 30,
    price: 25
  },
  {
    id: 'fade',
    name: 'Fade Haircut',
    description: 'Modern fade with precision blending',
    duration: 45,
    price: 30
  },
  {
    id: 'beard-trim',
    name: 'Beard Trim',
    description: 'Shape and trim your beard',
    duration: 20,
    price: 15
  },
  {
    id: 'haircut-beard',
    name: 'Haircut & Beard Combo',
    description: 'Complete grooming package',
    duration: 50,
    price: 40
  },
  {
    id: 'kids-haircut',
    name: "Kids' Haircut",
    description: 'Haircut for children under 12',
    duration: 25,
    price: 20
  },
  {
    id: 'buzz-cut',
    name: 'Buzz Cut',
    description: 'Quick all-over buzz cut',
    duration: 15,
    price: 15
  }
];

/**
 * @route   GET /api/services
 * @desc    Get all available services
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: services.length,
    data: services
  });
});

/**
 * @route   GET /api/services/:id
 * @desc    Get single service by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  const service = services.find(s => s.id === req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }
  
  res.json({
    success: true,
    data: service
  });
});

export default router;
