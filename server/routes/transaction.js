const express = require('express');
const { create, read, update, deleteTransactionEntry, readByQuery, daily, searchDailyTransaction } = require('../controller/transaction');
const router = express.Router();

router.post('/create',create);
router.get('/',read);
router.put('/',update);
router.delete('/:id',deleteTransactionEntry);
router.get('/read',readByQuery);
router.get('/daily',daily);
router.get('/search',searchDailyTransaction);


module.exports = router;