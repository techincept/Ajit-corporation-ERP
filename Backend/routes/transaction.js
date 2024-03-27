const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const {
  create,
  read,
  daily,
  readByQuery,
  update,
  searchDailyTransaction,
  deleteTransactionEntry
} = require("../controllers/transaction");
const router = express.Router();

router.get("/", read);
router.get("/daily", daily);
router.post("/", adminAuth, create);
router.post("/search", adminAuth, readByQuery);
router.put("/", adminAuth, update);
router.delete("/:id",adminAuth,deleteTransactionEntry);
router.get('/daily-transaction',searchDailyTransaction)
module.exports = router;
