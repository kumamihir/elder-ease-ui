const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

async function getOverview(req, res) {
  const doctorId = req.user.id;
  const [numPatients, upcomingAppointmentsCount, topDiagnoses] = await Promise.all([
    Patient.countDocuments({ assignedDoctor: doctorId }),
    Appointment.countDocuments({ doctor: doctorId, datetime: { $gte: new Date() }, status: { $in: ['pending', 'approved', 'rescheduled'] } }),
    Patient.aggregate([
      { $match: { assignedDoctor: require('mongoose').Types.ObjectId.createFromHexString(doctorId) } },
      { $unwind: { path: '$medicalHistory', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$medicalHistory.diagnosis', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { diagnosis: '$_id', count: 1, _id: 0 } },
    ]),
  ]);

  res.json({ numPatients, upcomingAppointmentsCount, topDiagnoses });
}

module.exports = { getOverview };