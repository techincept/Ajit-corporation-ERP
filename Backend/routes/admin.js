const express = require("express");

const { createUser, login, getAllUsers, getComission } = require("../controllers/admin");
const { adminAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", adminAuth, createUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.get('/comission',adminAuth,getComission)

module.exports = router;
