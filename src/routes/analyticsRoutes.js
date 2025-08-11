const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getOverview } = require('../controllers/analyticsController');

const router = express.Router();

router.use(authenticate, authorizeRoles('doctor'));

router.get('/overview', getOverview);

module.exports = router;