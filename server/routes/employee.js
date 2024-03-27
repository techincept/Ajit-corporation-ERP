const express =require('express');
const router = express.Router();

router.use('/party',require('./party.js'))
router.use('/transaction',require('./transaction.js'));
router.use('/cashbook',require('./cashbook.js'));
module.exports = router