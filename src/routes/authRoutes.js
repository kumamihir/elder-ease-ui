const express = require('express');
const { handleValidation } = require('../middleware/validate');
const {
  registerDoctor,
  registerPatient,
  login,
  registerDoctorValidators,
  registerPatientValidators,
  loginValidators,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register/doctor', registerDoctorValidators, handleValidation, registerDoctor);
router.post('/register/patient', registerPatientValidators, handleValidation, registerPatient);
router.post('/login', loginValidators, handleValidation, login);

module.exports = router;