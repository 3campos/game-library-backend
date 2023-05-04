const express = require('express')
const router = express.Router()
const ctrls = require("../controllers")

router.get("/", ctrls.users.index)
router.post("/", ctrls.users.create)

module.exports = router;