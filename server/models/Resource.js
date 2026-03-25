const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  type: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: ['video', 'notes', 'textbook', 'website', 'practice_problems', 'other'],
  },
  url: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'URL must start with http:// or https://'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  // Array of user IDs who have upvoted this resource
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resource', resourceSchema);
