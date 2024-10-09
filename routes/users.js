const router = require("express").Router();
const { getUsers, createUser, findUsers } = require("../controlllers/users");

router.get("/", getUsers);
router.get("/:userId", findUsers);
router.post("/", createUser);

module.exports = router;
