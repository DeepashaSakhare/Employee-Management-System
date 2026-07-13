const Employee = require('../models/Employee');

// Generate next employee ID in format EMP001, EMP002, ...
const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
  if (!lastEmployee) {
    return 'EMP001';
  }

  const lastEmployeeId = lastEmployee.employeeId;
  const numericPart = parseInt(lastEmployeeId.replace('EMP', ''), 10);
  const nextNumeric = numericPart + 1;
  return `EMP${nextNumeric.toString().padStart(3, '0')}`;
};

// Fetch list of employees, optionally filtered by search query
exports.getEmployees = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { employeeId: new RegExp(search, 'i') }
      ];
    }

    if (department) {
      query.department = department;
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
};

// Fetch a single employee by ID
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// Create a new employee record
exports.createEmployee = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      gender,
      address,
      status
    } = req.body;

    if (!fullName || !email || !phone || !department || !designation || !salary || !joiningDate || !gender || !address || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const employeeId = await generateEmployeeId();

    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      gender,
      address,
      status
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.email) {
      const duplicate = await Employee.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// Delete an employee record
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};
