const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST_STATUS_CODE } = require("../utils/errors");
const { EXISTENTIAL_STATUS_CODE } = require("../utils/errors");
const { DEFAULT_STATUS_CODE } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((user) => res.send(user))
    .catch((error) => {
      console.error(error);
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};
const deleteItem = (req, res) =>
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .select("+owner")
    .then((item) => {
      // select the owner field to check if the user is authorized
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN_STATUS_CODE.error)
          .send({ message: FORBIDDEN_STATUS_CODE.message });
      }
      if (!item) {
        return res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message });
      }
      res.send({ data: item });
    }) // if item is not found, return a response with status code 404
    // if item is found, return a response with status code 200

    .orFail()
    .then((item) => {
      res.send(item); // skipped, because an error was thrown
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message });
      } else if (error.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      } else {
        res
          .status(DEFAULT_STATUS_CODE.error)
          .send({ message: DEFAULT_STATUS_CODE.message });
      }
    });
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      }
      // if no errors match, return a response with status code 500
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send(item); // skipped, because an error was thrown
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message });
      } else if (error.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      } else {
        res
          .status(DEFAULT_STATUS_CODE.error)
          .send({ message: DEFAULT_STATUS_CODE.message });
      }
    });
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send(item); // skipped, because an error was thrown
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message });
      } else if (error.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      } else {
        res
          .status(DEFAULT_STATUS_CODE.error)
          .send({ message: DEFAULT_STATUS_CODE.message });
      }
    });
module.exports = {
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
  getItems,
};
