const router = require("express").Router();

const {
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
  getItems,
} = require("../controlllers/clothingItem");
//crud
router.get("/items", getItems);
//create
router.post("/", createItem);
//delete items
router.delete("/items/:itemId", deleteItem);
// Like and dislike
router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", dislikeItem);
module.exports = router;
