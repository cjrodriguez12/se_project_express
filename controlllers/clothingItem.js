const express = require("express");
const ClothingItem = require("../models/clothingItem");
const BAD_REQUEST_STATUS_CODE = require("../utils/errors");
const EXISTENTIAL_STATUS_CODE = require("../utils/errors");
const DEFAULT_STATUS_CODE = require("../utils/errors");
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { userId } = req.params;
  ClothingItem.findById(userId)
    .orFail() // throws a DocumentNotFoundError
    .then((item) => {
      res.send(item); // skipped, because an error was thrown
    })
    .catch((error) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
        error
      );
    });
  const { name, weather, imageURL } = req.body;
  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "BadRequest") {
        return res
          .status(EXISTENTIAL_STATUS_CODE)
          .send({ EXISTENTIAL_STATUS_CODE: message });
      } else {
        // if no errors match, return a response with status code 500
        return res
          .status(DEFAULT_STATUS_CODE)
          .send({ DEFAULT_STATUS_CODE: message });
      }
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .catch((e) => {
      res.status(DEFAULT_STATUS_CODE).send({ DEFAULT_STATUS_CODE: message, e });
    });
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .catch((e) => {
      res.status(DEFAULT_STATUS_CODE).send({ DEFAULT_STATUS_CODE: message, e });
    });
module.exports = {
  createItem,
  likeItem,
  dislikeItem,
};
