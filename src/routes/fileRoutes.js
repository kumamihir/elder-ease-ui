const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const {
  uploadPrescription,
  listPrescriptions,
  downloadPrescription,
  uploadReport,
  listReports,
  downloadReport,
  uploadValidators,
} = require('../controllers/fileController');

const router = express.Router();

router.use(authenticate);

// Prescriptions
router.post('/prescriptions/:patientId', authorizeRoles('doctor'), uploadValidators, handleValidation, uploadPrescription);
router.get('/prescriptions/:patientId', listPrescriptions);
router.get('/prescriptions/download/:id', downloadPrescription);

// Reports
router.post('/reports/:patientId', authorizeRoles('doctor'), uploadValidators, handleValidation, uploadReport);
router.get('/reports/:patientId', listReports);
router.get('/reports/download/:id', downloadReport);

module.exports = router;