const signup = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // First hash the password
  bcrypt
    .hash(password, 11)
    .then((hash) =>
      // Create user with hashed password
      User.create({
        name,
        avatar,
        email,
        password: hash, // Store the hashed password
      })
    )
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
        return res
          .status(CONFLICT_STATUS_CODE.error)
          .send({ message: CONFLICT_STATUS_CODE.message });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE.error)
          .send({ message: BAD_REQUEST_STATUS_CODE.message });
      }
      return res
        .status(DEFAULT_STATUS_CODE.error)
        .send({ message: DEFAULT_STATUS_CODE.message });
    });
};
const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail()
    .then((user) => res.send(user)) // Send user data
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
const signin = (req, res) => {
  const { email, password } = req.body;
  User.findById({ email }).then((user) => {
    if (!user) {
      return res
        .status(UNAUTHORIZED_STATUS_CODE.error)
        .send({ message: UNAUTHORIZED_STATUS_CODE.message });
    }
    // Compare the password with the hashed password in the database
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return res
          .status(UNAUTHORIZED_STATUS_CODE.error)
          .send({ message: UNAUTHORIZED_STATUS_CODE.message });
      }
      // Generate a JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token }); // Send the token back to the client
    });
  });
};
