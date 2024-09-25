const router = require("express").Router();
const { getUsers, createUser } = require("../controlllers/users");
router.get("/", getUsers);
router.get("/items/:itemId/", getUsers);
router.post("/", createUser);

module.exports = router;
