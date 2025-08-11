const mongoose = require('mongoose');

const MedicalHistoryEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    diagnosis: { type: String, required: true },
    notes: { type: String },
  },
  { _id: false }
);

const MedicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String },
  },
  { _id: false }
);

const VitalSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    heartRate: Number,
    bloodPressure: String,
    temperature: Number,
  },
  { _id: false }
);

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    age: { type: Number, required: true },
    medicalHistory: [MedicalHistoryEntrySchema],
    ongoingTreatment: { type: String },
    medicationSchedule: [MedicationSchema],
    vitals: [VitalSchema],
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    // Authentication for patient
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'patient', enum: ['patient'] },
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;