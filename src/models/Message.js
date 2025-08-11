const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    senderRole: { type: String, enum: ['doctor', 'patient'], required: true },
    type: { type: String, enum: ['text', 'call'], default: 'text' },
    content: { type: String, required: true },
    metadata: { type: Object },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;