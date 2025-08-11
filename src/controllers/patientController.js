const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const MedicalReport = require('../models/MedicalReport');
const Appointment = require('../models/Appointment');

async function getMe(req, res) {
  const patientId = req.user.id;
  const patient = await Patient.findById(patientId).select('-passwordHash');
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
}

async function getHistory(req, res) {
  const patientId = req.user.id;
  const [prescriptions, reports, appointments] = await Promise.all([
    Prescription.find({ patient: patientId }).sort({ createdAt: -1 }),
    MedicalReport.find({ patient: patientId }).sort({ createdAt: -1 }),
    Appointment.find({ patient: patientId }).sort({ datetime: -1 }),
  ]);
  res.json({ prescriptions, reports, appointments });
}

module.exports = { getMe, getHistory };