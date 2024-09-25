const router = require("express").Router();

const {
  createItem,
  likeItem,
  dislikeItem,
} = require("../controlllers/clothingItem");
//crud
router.get("/items");
//create
router.post("/", createItem);
//delete items
router.delete("/items/:itemId");
// Like and dislike
router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", dislikeItem);
module.exports = router;
