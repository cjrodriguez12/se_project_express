const router = require("express").Router();
const { getUsers, createUser } = require("../controlllers/users");
// router.get("/", getUsers);
router.get("/:userId", () => console.log("Get Users by ID"));
router.post("/", createUser);

module.exports = router;
