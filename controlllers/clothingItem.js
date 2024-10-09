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
    .orFail()
    .then((item) => {
      res.send(item); // skipped, because an error was thrown
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message, error });
      } else if (error.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message, error });
      } else {
        res
          .status(DEFAULT_STATUS_CODE.error)
          .send({ message: DEFAULT_STATUS_CODE.message, error });
      }
    });
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { owner } = req.user._id;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message });
      }
      // if no errors match, return a response with status code 500
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });

  //   ClothingItem.findById(userId)
  //     .orFail() // throws a DocumentNotFounderror
  //     .then((item) => {
  //       res.send(item); // skipped, because an error was thrown
  //     })
  //     .catch((error) => {
  //       console.error(
  //         `error ${err.name} with the message ${err.message} has occurred while executing the code`,
  //         error
  //       );
  //     });
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
          .send({ message: EXISTENTIAL_STATUS_CODE.message, error });
      } else if (error.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message, error });
      } else {
        res
          .status(DEFAULT_STATUS_CODE.error)
          .send({ message: DEFAULT_STATUS_CODE.message, error });
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
          .send({ message: EXISTENTIAL_STATUS_CODE.message, error });
      } else if (error.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message, error });
      } else {
        res
          .status(DEFAULT_STATUS_CODE.error)
          .send({ message: DEFAULT_STATUS_CODE.message, error });
      }
    });
module.exports = {
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
  getItems,
};
