const User = require("../models/user");
const BAD_REQUEST_STATUS_CODE = require("../utils/errors");
const EXISTENTIAL_STATUS_CODE = require("../utils/errors");
const DEFAULT_STATUS_CODE = require("../utils/errors");
// GET USERS

const getUsers = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(EXISTENTIAL_STATUS_CODE)
          .send({ EXISTENTIAL_STATUS_CODE: message });
      } else {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ BAD_REQUEST_STATUS_CODE: message });
      }
      return res
        .status(DEFAULT_STATUS_CODE)
        .send({ DEFAULT_STATUS_CODE: message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ BAD_REQUEST_STATUS_CODE: message });
      }
      return res
        .status(DEFAULT_STATUS_CODE)
        .send({ DEFAULT_STATUS_CODE: message });
    });
};

module.exports = { getUsers, createUser };
