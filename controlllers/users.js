const User = require("../models/user");
const { BAD_REQUEST_STATUS_CODE } = require("../utils/errors");
const { EXISTENTIAL_STATUS_CODE } = require("../utils/errors");
const { DEFAULT_STATUS_CODE } = require("../utils/errors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//The method is ready. Now we can apply it to the authentication handler:
// controllers/users.js

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(req.body.password, 10).then((hash) =>
    User.create({
      email: req.body.email,
      password: hash,
    })
  );

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
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
    })
    .catch((err) => {
      // authentication error
      res.status(401).send({ message: err.message });
    });
};
// GET USERS
const findUsers = (req, res) => {
  const { userId } = req.params;
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
module.exports = { getUsers, createUser, findUsers };
