const router = require("express").Router();

const { createItem } = require("../controlllers/clothingItem");
//crud
router.post("/", createItem);
//create
module.exports = router;
