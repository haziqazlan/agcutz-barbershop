import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

export const appointmentValidation = [
  body('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('customerEmail')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('customerPhone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Please provide a valid phone number'),
  
  body('appointmentType')
    .notEmpty().withMessage('Appointment type is required')
    .isIn(['inPerson', 'outcall']).withMessage('Invalid appointment type'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  
  body('timeSlot')
    .notEmpty().withMessage('Time slot is required')
    .matches(/^\d{2}:\d{2}$/).withMessage('Time slot must be in HH:MM format'),
  
  // Conditional validation for outcall address
  body('address.street')
    .if(body('appointmentType').equals('outcall'))
    .trim()
    .notEmpty().withMessage('Street address is required for outcall appointments'),
  
  body('address.city')
    .if(body('appointmentType').equals('outcall'))
    .trim()
    .notEmpty().withMessage('City is required for outcall appointments'),
  
  body('address.zip')
    .if(body('appointmentType').equals('outcall'))
    .trim()
    .notEmpty().withMessage('Zip code is required for outcall appointments'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];
