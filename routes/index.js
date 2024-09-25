const router = require("express").Router();
const itemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res
    .status(EXISTENTIAL_STATUS_CODE)
    .send({ EXISTENTIAL_STATUS_CODE: message });
});
module.exports = router;
