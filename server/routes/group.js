const express = require('express');
const { readGroup, createGroup } = require('../controller/group');
const router = express.Router();

router.get('/',readGroup);
router.post('/',createGroup);

module.exports = router