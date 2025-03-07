const router = require("express").Router();
router.get("/:userId", getCurrentUsers);
router.post("/users/me", updateProfile);
module.exports = router;
