const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { body } = require('express-validator');
const Prescription = require('../models/Prescription');
const MedicalReport = require('../models/MedicalReport');
const Patient = require('../models/Patient');

const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

ensureDir(uploadRoot);
ensureDir(path.join(uploadRoot, 'prescriptions'));
ensureDir(path.join(uploadRoot, 'reports'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.uploadType; // set by route handler
    const folder = type === 'prescription' ? 'prescriptions' : 'reports';
    cb(null, path.join(uploadRoot, folder));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});

const upload = multer({ storage });

const uploadValidators = [
  body('description').optional().isString(),
];

async function uploadPrescription(req, res) {
  req.uploadType = 'prescription';
  const doctorId = req.user.id;
  const { patientId } = req.params;
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (patient.assignedDoctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const record = await Prescription.create({
      patient: patientId,
      doctor: doctorId,
      description: req.body.description,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filePath: req.file.path,
    });
    res.status(201).json(record);
  });
}

async function listPrescriptions(req, res) {
  const role = req.user.role;
  const userId = req.user.id;
  const { patientId } = req.params;
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (!(role === 'doctor' && patient.assignedDoctor.toString() === userId) && !(role === 'patient' && patient._id.toString() === userId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const list = await Prescription.find({ patient: patientId }).sort({ createdAt: -1 });
  res.json(list);
}

async function downloadPrescription(req, res) {
  const { id } = req.params;
  const role = req.user.role;
  const userId = req.user.id;
  const record = await Prescription.findById(id).populate('patient', 'assignedDoctor');
  if (!record) return res.status(404).json({ message: 'Not found' });
  const patient = record.patient;
  if (!(role === 'doctor' && patient.assignedDoctor.toString() === userId) && !(role === 'patient' && patient._id.toString() === userId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.download(path.resolve(record.filePath), record.originalName);
}

async function uploadReport(req, res) {
  req.uploadType = 'report';
  const doctorId = req.user.id;
  const { patientId } = req.params;
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (patient.assignedDoctor.toString() !== doctorId) return res.status(403).json({ message: 'Forbidden' });
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const record = await MedicalReport.create({
      patient: patientId,
      doctor: doctorId,
      description: req.body.description,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filePath: req.file.path,
    });
    res.status(201).json(record);
  });
}

async function listReports(req, res) {
  const role = req.user.role;
  const userId = req.user.id;
  const { patientId } = req.params;
  const patient = await Patient.findById(patientId);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  if (!(role === 'doctor' && patient.assignedDoctor.toString() === userId) && !(role === 'patient' && patient._id.toString() === userId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const list = await MedicalReport.find({ patient: patientId }).sort({ createdAt: -1 });
  res.json(list);
}

async function downloadReport(req, res) {
  const { id } = req.params;
  const role = req.user.role;
  const userId = req.user.id;
  const record = await MedicalReport.findById(id).populate('patient', 'assignedDoctor');
  if (!record) return res.status(404).json({ message: 'Not found' });
  const patient = record.patient;
  if (!(role === 'doctor' && patient.assignedDoctor.toString() === userId) && !(role === 'patient' && patient._id.toString() === userId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.download(path.resolve(record.filePath), record.originalName);
}

module.exports = {
  uploadPrescription,
  listPrescriptions,
  downloadPrescription,
  uploadReport,
  listReports,
  downloadReport,
  uploadValidators,
};