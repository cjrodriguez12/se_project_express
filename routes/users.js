const router = require("express").Router();
const { getCurrentUsers, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUsers);
router.patch("/me", auth, updateUser);
module.exports = router;
