const router = require("express").Router();
router.get("/:userId", findUsers);
module.exports = router;
