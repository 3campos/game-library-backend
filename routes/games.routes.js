const express = require('express')
const router = express.Router()
const ctrls = require("../controllers")

router.get("/", ctrls.games.index)
router.post("/", ctrls.games.create)
router.put("/:id", ctrls.games.update)
router.delete("/:id", ctrls.games.destroy)

module.exports = router;