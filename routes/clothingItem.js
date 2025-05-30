const router = require("express").Router();
const auth = require("../middlewares/auth");
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
router.post("/", auth, createItem);
// delete items
router.delete("/:itemId", auth, deleteItem);
// Like and dislike
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);
module.exports = router;
