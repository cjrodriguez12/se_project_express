const router = require("express").Router();
const { getCurrentUsers, updateProfile } = require("../controllers/users");
router.get("/:userId", getCurrentUsers);
router.post("/users/me", updateProfile);
module.exports = router;
