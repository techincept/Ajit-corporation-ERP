const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/auth.js");
const { create, read, update } = require("../controllers/party");

router.get("/", adminAuth, read);
router.post("/create", adminAuth, create);
router.put("/", adminAuth, update);

module.exports = router;
