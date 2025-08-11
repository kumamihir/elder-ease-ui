const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    specialization: { type: String },
    role: { type: String, default: 'doctor', enum: ['doctor'] },
  },
  { timestamps: true }
);

DoctorSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;