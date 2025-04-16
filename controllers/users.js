const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {
  BAD_REQUEST_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  EXISTENTIAL_STATUS_CODE,
  DEFAULT_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");
const User = require("../models/user");
// GET USERS
const getCurrentUsers = (req, res) => {
  const userId = req.user._id;
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
      } else if (error.name === "UnauthorizedError") {
        res
          .status(UNAUTHORIZED_STATUS_CODE.error)
          .send({ message: UNAUTHORIZED_STATUS_CODE.message });
      } else {
        res
          .status(DEFAULT_STATUS_CODE.error)
          .send({ message: DEFAULT_STATUS_CODE.message });
      }
    });
};
const getUsers = (req, res) => {
  // find all users
  // and send them to the client
  User.find({})
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message });
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
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // First hash the password
  bcrypt
    .hash(password, 11)
    .then((hash) => {
      // Create user with hashed password
      return User.create({
        name,
        avatar,
        email,
        password: hash, // Store the hashed password
      });
    })
    .then((user) => {
      // Remove password from response
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        // Duplicate email error
        res
          .status(CONFLICT_STATUS_CODE.error)
          .send({ message: CONFLICT_STATUS_CODE.message });
      } else if (err.name === "ValidationError") {
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
const updateUser = (req, res) => {
  const allowedUpdates = ["name", "avatar"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  const userId = req.params.userId;
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
// The login method is responsible for authenticating the user.
// The method is ready. Now we can apply it to the authentication handler:
// controllers/users.js

const login = (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with:", { email, password: "****" });
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
    // the token is signed with the secret key
    // and expires in 7 days
    .then((user) => {
      // authentication successful! user is in the user variable
      console.log("User found:", user._id);
      console.log("About to sign token with secret:", JWT_SECRET);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log("Token generated:", token);
      res.send({ token });
    })
    // if user is not found, send an error
    .catch((error) => {
      console.log("Login attempt with:", { email, password: "****" });
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      }
      if (error.name === "UnauthorizedError") {
        return res
          .status(UNAUTHORIZED_STATUS_CODE.error)
          .send({ message: UNAUTHORIZED_STATUS_CODE.message });
      }
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(EXISTENTIAL_STATUS_CODE.error)
          .send({ message: EXISTENTIAL_STATUS_CODE.message });
      }
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};
module.exports = { getUsers, createUser, getCurrentUsers, updateUser, login };
