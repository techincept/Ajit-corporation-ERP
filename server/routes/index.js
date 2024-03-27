const express = require("express");
const {
  superAdminAuth,
  adminAuth,
  employeeAuth,
} = require("../middleware/auth.js");
const { login } = require("../controller/employee.js");

const router = express.Router();

router.post("/login", login);

router.use("/super-admin", superAdminAuth, require("./superAdmin.js"));
router.use("/admin", adminAuth, require("./admin.js"));
router.use("/employee", employeeAuth, require("./employee.js"));
// router.use("/party", require("./party.js"));

module.exports = router;
