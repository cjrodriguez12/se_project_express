const User = require("../models/user");
const { BAD_REQUEST_STATUS_CODE } = require("../utils/errors");
const { EXISTENTIAL_STATUS_CODE } = require("../utils/errors");
const { DEFAULT_STATUS_CODE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GET USERS
const getCurrentUsers = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      console.error(error);
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
};
const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(EXISTENTIAL_STATUS_CODE)
          .error.send({ message: EXISTENTIAL_STATUS_CODE.message });
      }
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      }
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.create({ name, avatar, email, password })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      }
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};
const updateUser = (req, res) => {
  const allowedUpdates = ["name", "avatar"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  const userId = req.user._id;
  const { name, avatar } = req.body;
  if (!isValidOperation) {
    return res
      .status(BAD_REQUEST_STATUS_CODE.error)
      .send({ message: BAD_REQUEST_STATUS_CODE.message });
  }
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      }
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};
//The method is ready. Now we can apply it to the authentication handler:
// controllers/users.js

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  // check if email and password are valid
  if (!validator.isEmail(email)) {
    return res
      .status(BAD_REQUEST_STATUS_CODE.error)
      .send({ message: BAD_REQUEST_STATUS_CODE.message });
  }
  if (!validator.isLength(password, { min: 8 })) {
    return res
      .status(BAD_REQUEST_STATUS_CODE.error)
      .send({ message: BAD_REQUEST_STATUS_CODE.message });
  }
  // find user
  User.findUserByCredentials(email, password)
    // if user is found, create a token
    // and send it to the client
    // the token is signed with the secret key
    // and expires in 7 days
    // the token is sent in the response body
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      }
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .error.send({ message: UNAUTHORIZED_STATUS_CODE.message });
      }
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};
module.exports = { getUsers, createUser, getCurrentUsers, updateUser, login };
