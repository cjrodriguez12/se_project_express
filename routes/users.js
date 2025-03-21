const router = require("express").Router();
const { getCurrentUsers, updateUser } = require("../controllers/users");
router.get("/:userId", getCurrentUsers);
router.post("/:userId", updateUser);
module.exports = router;
