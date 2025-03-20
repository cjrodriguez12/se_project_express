const router = require("express").Router();

const {
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
  getItems,
} = require("../controllers/clothingItem");
// crud
router.get("/", getItems);
// create
router.post("/", createItem);
// delete items
router.delete("/:itemId", deleteItem);
// Like and dislike
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
