const { validationResult } = require('express-validator');
const Course = require('../models/Course');

exports.getCourses = async (req, res) => {
  try {
    const { search, department, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }
    if (department && department.trim()) {
      query.department = { $regex: new RegExp(`^${department.trim()}$`, 'i') };
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(50, parseInt(limit));
    const limitVal = Math.min(50, parseInt(limit));

    const [courses, total] = await Promise.all([
      Course.find(query).sort({ code: 1 }).skip(skip).limit(limitVal),
      Course.countDocuments(query),
    ]);

    res.json({
      courses,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitVal),
    });
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ error: 'Server error fetching courses' });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ course });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(500).json({ error: 'Server error fetching course' });
  }
};

exports.createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = await Course.create(req.body);
    res.status(201).json({ course });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A course with this code already exists' });
    }
    console.error('Create course error:', err);
    res.status(500).json({ error: 'Server error creating course' });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Course.distinct('department');
    res.json({ departments: departments.sort() });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching departments' });
  }
};
