const express = require("express");
const router = express.Router();
const { login, register, validateToken } = require("../controllers/auth");

router.post("/register", register);

router.post("/login", login);

router.post("/validate-token", validateToken);

module.exports = router;
