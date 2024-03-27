const express = require('express');
const { getAllUsers, createEmployee, getComission } = require('../controller/admin');
const router = express.Router();

router.use('/city',require('./city.js'));
router.use('/group',require('./group.js'));
router.use('/transaction',require('./transaction.js'));
router.use('/cashbook',require('./cashbook.js'));

router.post('/employee',createEmployee);
router.get('/',getAllUsers);
router.get('/commission',getComission)

module.exports = router