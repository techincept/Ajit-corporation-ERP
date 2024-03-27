const express = require("express");
const { create, read, readByQuery } = require("../controllers/cashbook");
const { adminAuth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", read);
router.post("/", adminAuth, create);
router.post("/search", readByQuery);

module.exports = router;
