const mongoose = require('mongoose');

const taSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    officeHours: { type: String, trim: true },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  professor: {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    officeHours: { type: String, trim: true },
    officeLocation: { type: String, trim: true },
  },
  teachingAssistants: [taSchema],
  semester: {
    type: String,
    trim: true,
  },
  credits: {
    type: Number,
    min: 1,
    max: 6,
    default: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Full-text search index
courseSchema.index({ name: 'text', code: 'text', department: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
