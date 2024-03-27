const express = require('express');
const { createParty, readParty, updateParty } = require('../controller/party');
const router = express.Router();

router.post('/',createParty);
router.get('/',readParty);
router.put('/',updateParty);


module.exports = router;