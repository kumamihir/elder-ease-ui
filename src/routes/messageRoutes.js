const express = require('express');
const { authenticate } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const { sendMessage, getThread, sendMessageValidators } = require('../controllers/messageController');

const router = express.Router();

router.use(authenticate);

router.post('/', sendMessageValidators, handleValidation, sendMessage);
router.get('/thread', getThread);

module.exports = router;