const express = require('express');
const {getAllUsers, createAdmin } = require('../controller/superAdmin');
const router = express.Router();

router.post("/company",createAdmin);
router.get('/',getAllUsers);
// router.post("/user",createUser);

module.exports = router;