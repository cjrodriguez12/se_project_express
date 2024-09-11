const express = require("express");
const ClothingItem = require("../models/clothingItem");

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
      res.status(500).send({ message: "Error from createItem", e });
    });
};

module.exports = {
  createItem,
};
