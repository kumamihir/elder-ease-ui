const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getMe, getHistory } = require('../controllers/patientController');

const router = express.Router();

router.use(authenticate, authorizeRoles('patient'));

router.get('/me', getMe);
router.get('/history', getHistory);

module.exports = router;