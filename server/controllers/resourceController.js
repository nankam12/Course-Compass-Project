const { validationResult } = require('express-validator');
const Resource = require('../models/Resource');
const Course = require('../models/Course');

exports.getResources = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const resources = await Resource.find({ course: courseId })
      .populate('submittedBy', 'username')
      .sort({ createdAt: -1 })
      .lean();

    // Sort by vote count descending after fetching
    resources.sort((a, b) => b.votes.length - a.votes.length);

    res.json({ resources });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(500).json({ error: 'Server error fetching resources' });
  }
};

exports.addResource = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { title, type, url, description } = req.body;

    const resource = await Resource.create({
      title,
      type,
      url: url || undefined,
      description: description || undefined,
      course: courseId,
      submittedBy: req.user._id,
    });

    await resource.populate('submittedBy', 'username');

    res.status(201).json({ resource });
  } catch (err) {
    console.error('Add resource error:', err);
    res.status(500).json({ error: 'Server error adding resource' });
  }
};

exports.voteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const userId = req.user._id;
    const hasVoted = resource.votes.some((vote) => vote.equals(userId));

    if (hasVoted) {
      resource.votes = resource.votes.filter((vote) => !vote.equals(userId));
    } else {
      resource.votes.push(userId);
    }

    await resource.save();

    res.json({ voteCount: resource.votes.length, hasVoted: !hasVoted });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.status(500).json({ error: 'Server error updating vote' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (!resource.submittedBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.status(500).json({ error: 'Server error deleting resource' });
  }
};
