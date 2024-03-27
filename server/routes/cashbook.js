const express = require('express');
const { create, read, readByQuery } = require('../controller/cashbook');
const router = express.Router();

router.post('/',create);
router.get('/',read);
router.get('/read',readByQuery);

module.exports = router;