const router = require("express").Router();
const itemRouter = require("./clothingItem");
const userrouter = require("./users");
const { EXISTENTIAL_STATUS_CODE } = require("../utils/errors");

router.use("/users", userrouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res
    .status(EXISTENTIAL_STATUS_CODE)
    .send({ message: EXISTENTIAL_STATUS_CODE.message });
});
module.exports = router;
