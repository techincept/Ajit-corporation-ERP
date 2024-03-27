const express = require('express');
const { createCity, readCity, updateCity } = require('../controller/city');

const router = express.Router();

router.post('/',createCity);
router.get('/',readCity);
router.put('/',updateCity);

module.exports = router