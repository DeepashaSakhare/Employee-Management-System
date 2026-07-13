const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    required: [true, 'Status is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
