const { body, param } = require('express-validator');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalReport = require('../models/MedicalReport');

const createPatientValidators = [
  body('name').isString().trim().notEmpty(),
  body('age').isInt({ min: 0 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('ongoingTreatment').optional().isString(),
  body('medicationSchedule').optional().isArray(),
];

async function listPatients(req, res) {
  const doctorId = req.user.id;
  const patients = await Patient.find({ assignedDoctor: doctorId }).select('-passwordHash');
  res.json(patients);
}

async function createPatient(req, res) {
  const doctorId = req.user.id;
  const { name, age, email, ongoingTreatment, medicationSchedule } = req.body;
  const passwordHash = '$2a$10$placeholderplaceholderplaceholderplch';
  const existing = email ? await Patient.findOne({ email }) : null;
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const patient = await Patient.create({ name, age, email, ongoingTreatment, medicationSchedule, assignedDoctor: doctorId, passwordHash });
  res.status(201).json({ id: patient._id });
}

async function getPatient(req, res) {
  const doctorId = req.user.id;
  const { patientId } = req.params;
  const patient = await Patient.findById(patientId).select('-passwordHash');
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (patient.assignedDoctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });
  res.json(patient);
}

async function updatePatient(req, res) {
  const doctorId = req.user.id;
  const { patientId } = req.params;
  const updates = req.body;
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (patient.assignedDoctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });
  const fields = ['name', 'age', 'medicalHistory', 'ongoingTreatment', 'medicationSchedule', 'vitals'];
  for (const field of fields) {
    if (updates[field] !== undefined) patient[field] = updates[field];
  }
  await patient.save();
  res.json({ message: 'Updated' });
}

async function deletePatient(req, res) {
  const doctorId = req.user.id;
  const { patientId } = req.params;
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (patient.assignedDoctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });
  await patient.deleteOne();
  res.json({ message: 'Deleted' });
}

async function viewDetailedProfile(req, res) {
  const doctorId = req.user.id;
  const { patientId } = req.params;
  const patient = await Patient.findById(patientId).select('-passwordHash');
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (patient.assignedDoctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });

  const [appointments, prescriptions, reports] = await Promise.all([
    Appointment.find({ patient: patient._id, doctor: doctorId }).sort({ datetime: -1 }),
    Prescription.find({ patient: patient._id, doctor: doctorId }).sort({ createdAt: -1 }),
    MedicalReport.find({ patient: patient._id, doctor: doctorId }).sort({ createdAt: -1 }),
  ]);

  res.json({ patient, appointments, prescriptions, reports });
}

module.exports = {
  listPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
  viewDetailedProfile,
  createPatientValidators,
};