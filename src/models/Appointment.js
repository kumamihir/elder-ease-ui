const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    datetime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rescheduled', 'cancelled'], default: 'pending' },
    reason: { type: String },
    notes: { type: String },
    rescheduledTo: { type: Date },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;