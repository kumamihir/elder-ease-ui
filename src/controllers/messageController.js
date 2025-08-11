const { body } = require('express-validator');
const Message = require('../models/Message');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const sendMessageValidators = [
  body('doctorId').isString().notEmpty(),
  body('patientId').isString().notEmpty(),
  body('content').isString().notEmpty(),
  body('type').optional().isIn(['text', 'call']),
];

async function sendMessage(req, res) {
  const { doctorId, patientId, content, type } = req.body;
  const role = req.user.role;
  const userId = req.user.id;

  // Validate participants exist
  const [doctor, patient] = await Promise.all([
    Doctor.findById(doctorId),
    Patient.findById(patientId),
  ]);
  if (!doctor || !patient) return res.status(400).json({ message: 'Doctor or patient not found' });

  // Access control: doctor must be the assigned doctor; patient must be the same patient
  if (role === 'doctor' && doctorId !== userId) return res.status(403).json({ message: 'Forbidden' });
  if (role === 'patient' && patientId !== userId) return res.status(403).json({ message: 'Forbidden' });

  const message = await Message.create({ doctor: doctorId, patient: patientId, senderRole: role, content, type: type || 'text' });
  res.status(201).json(message);
}

async function getThread(req, res) {
  const { doctorId, patientId } = req.query;
  if (!doctorId || !patientId) return res.status(400).json({ message: 'doctorId and patientId are required' });

  const role = req.user.role;
  const userId = req.user.id;
  if (role === 'doctor' && doctorId !== userId) return res.status(403).json({ message: 'Forbidden' });
  if (role === 'patient' && patientId !== userId) return res.status(403).json({ message: 'Forbidden' });

  const messages = await Message.find({ doctor: doctorId, patient: patientId }).sort({ createdAt: 1 });
  res.json(messages);
}

module.exports = { sendMessage, getThread, sendMessageValidators };