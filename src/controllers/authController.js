const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { generateToken } = require('../utils/generateToken');

const registerDoctorValidators = [
  body('name').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('specialization').optional().isString().trim(),
];

const registerPatientValidators = [
  body('name').isString().trim().notEmpty(),
  body('age').isInt({ min: 0 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('assignedDoctorId').isString().notEmpty(),
];

const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
  body('role').isIn(['doctor', 'patient']),
];

async function registerDoctor(req, res) {
  const { name, email, password, specialization } = req.body;
  const existing = await Doctor.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const doctor = await Doctor.create({ name, email, specialization, passwordHash });
  const token = generateToken({ _id: doctor._id, role: 'doctor' });
  res.status(201).json({ token, user: { id: doctor._id, role: 'doctor', name: doctor.name, email: doctor.email } });
}

async function registerPatient(req, res) {
  const { name, age, email, password, assignedDoctorId } = req.body;
  const doctor = await Doctor.findById(assignedDoctorId);
  if (!doctor) return res.status(400).json({ message: 'Assigned doctor not found' });
  if (email) {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) return res.status(409).json({ message: 'Email already in use' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const patient = await Patient.create({ name, age, email, passwordHash, assignedDoctor: doctor._id });
  const token = generateToken({ _id: patient._id, role: 'patient' });
  res.status(201).json({ token, user: { id: patient._id, role: 'patient', name: patient.name, email: patient.email } });
}

async function login(req, res) {
  const { email, password, role } = req.body;
  let userDoc = null;
  if (role === 'doctor') {
    userDoc = await Doctor.findOne({ email });
  } else if (role === 'patient') {
    userDoc = await Patient.findOne({ email });
  }
  if (!userDoc) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await userDoc.comparePassword
    ? await userDoc.comparePassword(password)
    : await bcrypt.compare(password, userDoc.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken({ _id: userDoc._id, role });
  res.json({ token, user: { id: userDoc._id, role, name: userDoc.name, email: userDoc.email } });
}

module.exports = {
  registerDoctor,
  registerPatient,
  login,
  registerDoctorValidators,
  registerPatientValidators,
  loginValidators,
};