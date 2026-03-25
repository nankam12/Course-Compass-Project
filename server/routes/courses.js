const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getCourses, getCourse, createCourse, getDepartments } = require('../controllers/courseController');
const { getResources, addResource } = require('../controllers/resourceController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Course routes
router.get('/', getCourses);
router.get('/departments', getDepartments);
router.get('/:id', getCourse);

router.post(
  '/',
  protect,
  [
    body('code').trim().notEmpty().withMessage('Course code is required'),
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
  ],
  createCourse
);

// Resource sub-routes (nested under a course)
router.get('/:courseId/resources', getResources);

router.post(
  '/:courseId/resources',
  protect,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Resource title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('type')
      .isIn(['video', 'notes', 'textbook', 'website', 'practice_problems', 'other'])
      .withMessage('Invalid resource type'),
    body('url')
      .optional({ nullable: true, checkFalsy: true })
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('URL must be a valid http:// or https:// address'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
  ],
  addResource
);

// Comment sub-routes (nested under a course)
router.get('/:courseId/comments', getComments);

router.post(
  '/:courseId/comments',
  protect,
  [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Comment cannot be empty')
      .isLength({ max: 1000 })
      .withMessage('Comment cannot exceed 1000 characters'),
  ],
  addComment
);

module.exports = router;
