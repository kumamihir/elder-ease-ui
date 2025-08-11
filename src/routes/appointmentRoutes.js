const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const {
  createAppointment,
  listAppointments,
  approveAppointment,
  rescheduleAppointment,
  cancelAppointment,
  createAppointmentValidators,
} = require('../controllers/appointmentController');

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('patient'), createAppointmentValidators, handleValidation, createAppointment);
router.get('/', listAppointments);
router.patch('/:id/approve', authorizeRoles('doctor'), approveAppointment);
router.patch('/:id/reschedule', authorizeRoles('doctor'), rescheduleAppointment);
router.patch('/:id/cancel', cancelAppointment);

module.exports = router;