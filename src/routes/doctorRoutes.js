const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const {
  listPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
  viewDetailedProfile,
  createPatientValidators,
} = require('../controllers/doctorController');

const router = express.Router();

router.use(authenticate, authorizeRoles('doctor'));

router.get('/patients', listPatients);
router.post('/patients', createPatientValidators, handleValidation, createPatient);
router.get('/patients/:patientId', getPatient);
router.put('/patients/:patientId', updatePatient);
router.delete('/patients/:patientId', deletePatient);
router.get('/patients/:patientId/profile', viewDetailedProfile);

module.exports = router;