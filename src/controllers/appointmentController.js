const { body, param } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const createAppointmentValidators = [
  body('doctorId').isString().notEmpty(),
  body('datetime').isISO8601(),
  body('reason').optional().isString(),
];

async function createAppointment(req, res) {
  const role = req.user.role;
  const userId = req.user.id;
  const { doctorId, datetime, reason } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return res.status(400).json({ message: 'Doctor not found' });

  let patientId = null;
  if (role === 'patient') {
    patientId = userId;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(400).json({ message: 'Patient not found' });
  } else if (role === 'doctor') {
    return res.status(403).json({ message: 'Doctors cannot book for patients' });
  }

  const appt = await Appointment.create({ doctor: doctorId, patient: patientId, datetime: new Date(datetime), reason });
  res.status(201).json(appt);
}

async function listAppointments(req, res) {
  const role = req.user.role;
  const userId = req.user.id;
  let filter = {};
  if (role === 'doctor') filter.doctor = userId;
  if (role === 'patient') filter.patient = userId;
  const appts = await Appointment.find(filter).populate('doctor', 'name').populate('patient', 'name').sort({ datetime: -1 });
  res.json(appts);
}

async function approveAppointment(req, res) {
  const doctorId = req.user.id;
  const { id } = req.params;
  const appt = await Appointment.findById(id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  if (appt.doctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });
  appt.status = 'approved';
  await appt.save();
  res.json({ message: 'Approved' });
}

async function rescheduleAppointment(req, res) {
  const doctorId = req.user.id;
  const { id } = req.params;
  const { datetime } = req.body;
  const appt = await Appointment.findById(id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  if (appt.doctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });
  appt.rescheduledTo = new Date(datetime);
  appt.status = 'rescheduled';
  await appt.save();
  res.json({ message: 'Rescheduled' });
}

async function cancelAppointment(req, res) {
  const { id } = req.params;
  const appt = await Appointment.findById(id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  const role = req.user.role;
  const userId = req.user.id;
  if (!(role === 'doctor' && appt.doctor.toString() === userId) && !(role === 'patient' && appt.patient.toString() === userId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  appt.status = 'cancelled';
  await appt.save();
  res.json({ message: 'Cancelled' });
}

module.exports = {
  createAppointment,
  listAppointments,
  approveAppointment,
  rescheduleAppointment,
  cancelAppointment,
  createAppointmentValidators,
};