const express = require('express')
const router = express.Router()
const ctrls = require("../controllers")

//CONTINUE HERE!

router.get("/library", ctrls.games.index)
router.post("/library", ctrls.games.create)
router.put("/library/:id", ctrls.games.update)
router.delete("library/:id", ctrls.games.destroy)

module.exports = router;