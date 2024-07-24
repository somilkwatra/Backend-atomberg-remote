const express = require("express");
const router = express.Router();
const { getUser, deleteUser } = require("../controllers/user");

router.get("/:id", getUser);

router.delete("/:id", deleteUser);

module.exports = router;
