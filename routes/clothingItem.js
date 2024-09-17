const router = require("express").Router();

const {
  createItem,
  likeItem,
  dislikeItem,
} = require("../controlllers/clothingItem");
//crud
router.post("/", createItem);
//create
router.put("/items/:itemId/likes", likeItem);

router.delete("/items/:itemId/likes", dislikeItem);
module.exports = router;
